<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="key"
        header-align="center"
        align="center"
        label="参数名">
      </el-table-column>
      <el-table-column
        prop="value"
        header-align="center"
        align="center"
        label="参数值">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button v-if="isAuth('sys:config:update')" type="primary" icon="el-icon-edit" plain circle size="mini" @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-if="isAuth('sys:config:delete')" type="danger" icon="el-icon-delete" plain circle size="mini" @click="deleteHandle(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-form class="table-bottom-wrapper">
      <el-form-item>
        <el-button v-if="isAuth('sys:config:save')" type="primary" plain icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:config:delete')" type="danger" plain icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
  </div>
</template>

<script>
import API from '@/api';
import AddOrUpdate from './add-or-update';
export default {
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
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
        key: this.dataForm.key
      };
      API.sys.config.list(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
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
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.sys.config.del(ids).then(({ data }) => {
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
