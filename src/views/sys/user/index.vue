<template>
  <div class="mod-user list-page">
    <el-form :inline="true" :model="dataForm" class="filter-form-inline filter-form" @keyup.enter.native="getDataList()">
      <el-form-item label="用户名">
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :default-sort="{ prop: 'createTime', order: 'ascending' }"
      @selection-change="selectionChangeHandle"
      ref="table"
      style="width: 100%;">
      <el-table-column
        fixed
        type="selection"
        header-align="center"
        align="center"
        width="50" className="td-item">
      </el-table-column>
      <!-- 展开查看 -->
      <el-table-column type="expand" v-if="isAuth('sys:user:info')">
        <template slot-scope="props">
          <el-form label-position="right" inline class="table-expand table-user">
            <el-form-item label="域账号：">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="用户名：">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="用户区域：">
              <span>{{ props.row.userArea }}</span>
            </el-form-item>
            <el-form-item label="工号：">
              <span>{{ props.row.jobNumber }}</span>
            </el-form-item>
            <el-form-item label="邮箱：">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="手机号：">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="状态：">
              <el-tag :type="props.row.status == 1 ? 'success' : 'danger'">
                {{ props.row.status == 1 ? '可用的' : '禁用的' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="创建人：">
              <span>{{ props.row.createUser }}</span>
            </el-form-item>
            <el-form-item label="修改时间：">
              <span>{{ props.row.modifyDate }}</span>
            </el-form-item>
            <el-form-item label="修改人：">
              <span>{{ props.row.modifyUser }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        width="80"
        label="域账号">
      </el-table-column>
      <el-table-column
        sortable
        prop="username"
        header-align="center"
        align="center"
        width="120"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="userArea"
        header-align="center"
        align="center"
        width="120"
        label="用户区域">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        min-width="180"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="150"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="jobNumber"
        header-align="center"
        align="center"
        width="120"
        label="工号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.status ? '可用的' : '禁用的'" placement="left">
            <el-switch :disabled="!isAuth('sys:user:update')" v-model="scope.row.status" @change="changeStatusHandle(scope.row)"></el-switch>
          </el-tooltip>
          <el-button type="primary" plain circle class="role-loading-btn" :loading="scope.row.isRolePosting" :style="{ display: scope.row.isRolePosting ? 'inline-block' : 'none' }"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="createTime"
        header-align="center"
        align="center"
        width="150"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        width="60"
        label="创建者">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button v-if="isAuth('sys:user:update')" type="primary" icon="el-icon-edit" plain circle size="mini" @click="addOrUpdateHandle(scope.row.userId)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-if="isAuth('sys:user:delete')" type="danger" icon="el-icon-delete" plain circle size="mini" @click="deleteHandle(scope.row.userId)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-form class="table-bottom-wrapper">
      <el-form-item>
        <el-button v-if="isAuth('sys:user:save')" type="primary" plain icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" plain icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button v-if="isAuth('sys:user:role')" type="primary" plain icon="el-icon-plus" @click="selectRoleHandle()" :disabled="dataListSelections.length !== 1">分配角色</el-button>
        <el-button v-if="isAuth('sys:user:export')" type="primary" plain icon="el-icon-upload" >批量导入</el-button>
      </el-form-item>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[15, 25, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, slot, sizes, prev, pager, next, jumper">
          <span class="pagiantion-slot">&nbsp;共&nbsp;{{ Math.ceil(totalCount / pageSize) }}&nbsp;页</span>
      </el-pagination>
    </el-form>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-or-update-role v-if="addOrUpdateRoleVisible" ref="addOrUpdateRole" @refreshDataList="getDataList"></add-or-update-role>
  </div>
</template>

<script>
import API from '@/api';
import AddOrUpdate from './add-or-update';
import AddOrUpdateRole from './add-or-update-role';

export default {
  data() {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addOrUpdateRoleVisible: false,
      switchValue: '',
      isRolePosting: true
    };
  },
  components: {
    AddOrUpdate,
    AddOrUpdateRole
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        username: this.dataForm.userName
      };
      API.sys.user.list(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list.map(data => {
            data['status'] = data['status'] === 0 ? false : true;
            data['isRolePosting'] = false;
            return data;
          });
          this.totalCount = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalCount = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 更改状态
    changeStatusHandle(row) {
      row.isRolePosting = true;
      let params = { ...row };
      params.status = params.status ? 1 : 0;
      API.sys.user.update(params).then(({ data }) => {
        row.isRolePosting = false;
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 分配角色
    selectRoleHandle() {
      if (this.dataListSelections.length === 0) return;

      let selection = [...this.dataListSelections][0];
      this.addOrUpdateRoleVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRole.init(selection);
      });
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.sys.user.del(userIds).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>
