var express = require('express');
var router = express.Router();
const { Admin } = require('../../models')
//模糊搜索需要
const { Op } = require('sequelize')
//错误类
const { NotFound } = require('../../utils/errors')
const { success, failure } = require('../../utils/response')
//中间件
const adminAuth = require('../../middlewares/admin-auth')

/**
 * 查询管理员列表(模糊搜索)++所有
 * GET /admin/admins
 */
router.get('/', async function (req, res, next) {
  try {
    //模糊查询
    const query = req.query

    //分页处理
    //当前是第几页，如果不传，那就是第一页
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    //每页显示多少条数据，如果不传，那就显示10条
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    //计算offset
    const offset = (currentPage - 1) * pageSize

    const condition = {
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
      where: {}
    }

    //模糊条件
    for (let key in query) {
      if (key !== 'pageSize' && key !== 'currentPage') {
        if (query[key] != null && query[key] !== '') {
          condition.where[key] = {
            [Op.like]: `%${query[key]}%`

          }

        }
      }
    }

    const { count, rows } = await Admin.findAndCountAll(condition)

    success(res, '查询管理员列表成功', {
      admins: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })
  }
  catch (error) {
    failure(res, error)
  }
});

/**
 * 查询管理员详情
 * GET /admin/admins/me
 */
router.get('/me', adminAuth, async function (req, res, next) {
  try {
    //查询当前管理员
    const admin = await Admin.findByPk(req.admin.id)

    success(res, '查询管理员详情成功', { admin })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 查询管理员详情
 * GET /admin/:id
 */
router.get('/:id', async function (req, res, next) {
  try {
    //查询当前管理员
    const admin = await Admin.findByPk(req.params.id)

    success(res, '查询管理员详情成功', { admin })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 创建管理员
 * POST /admin/admins
 */
router.post('/', async function (req, res,) {
  try {
    const admin = await Admin.create(req.body)
    success(res, '发送成功', { admin }, 201)
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 删除管理员
 * DELETE /admin/admins/:id
 */
router.delete('/:id', async function (req, res) {
  try {

    const idList = req.params.id.split(',')
    idList.forEach(async (id) => {
      req.params.id = id
      const admin = await getAdmin(req)
      await admin.destroy()
    })
    success(res, '删除管理员成功')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 更新管理员
 * PUT /admin/admins/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const admin = await getAdmin(req)

    await admin.update(req.body)

    success(res, '更新管理员成功', { admin })

  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：查询当前管理员
 */
async function getAdmin(req) {
  //获取管理员ID
  const { id } = req.params

  //查询当前管理员
  const admin = await Admin.findByPk(id)

  //如果没有找到就抛出异常
  if (!admin) {
    throw new NotFound(`ID:${id}的管理员未找到`)
  }
  return admin
}

module.exports = router;
