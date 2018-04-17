<template>
  <div class="mod-dictionary list-page">
    <!-- search filters -->
    <el-form :inline="true" :model="dataForm" class="filter-form-inline filter-form" @keyup.enter.native="getDataList()">
      <el-form-item label="数据字典">
        <el-input v-model="dataForm.codeType" placeholder="数据字典" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input v-model="dataForm.codeTypeName" placeholder="字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- table list datas -->
    <el-table border
    :data="dataList"
      :max-height="tableHeight"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50" className="td-item">
      </el-table-column>
      <el-table-column fixed prop="codeType" label="数据字典" align="center" header-align="center" width="100"></el-table-column>
      <el-table-column prop="codeTypeName" label="字典名称" align="center" header-align="center"></el-table-column>
      <el-table-column prop="code" label="字典编码" align="center" header-align="center" width="100"></el-table-column>
      <el-table-column prop="codeName" label="字典编码名" align="center" header-align="center"></el-table-column>
      <el-table-column prop="createUser" label="创建者" align="center" header-align="center" width="80"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" align="center" header-align="center" width="150"></el-table-column>
      <el-table-column prop="modifyUser" label="修改者" align="center" header-align="center" width="80"></el-table-column>
      <el-table-column prop="modifyDate" label="修改时间" align="center" header-align="center" width="150"></el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button v-if="isAuth('sys:role:update')" type="primary" icon="el-icon-edit" plain circle size="mini" @click="addOrUpdateHandle(scope.row.dataId)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-if="isAuth('sys:role:delete')" type="danger" icon="el-icon-delete" plain circle size="mini" @click="deleteHandle(scope.row.dataId)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagations datas -->
    <el-form class="table-bottom-wrapper">
      <el-form-item>
        <el-button icon="el-icon-plus" v-if="isAuth('data:dictionary:save')" type="primary" plain @click="addOrUpdateHandle()">新增</el-button>
        <el-button icon="el-icon-delete" v-if="isAuth('data:dictionary:delete')" type="danger" plain @click="deleteHandle()">批量删除</el-button>
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
import addOrUpdate from './add-or-update';

export default {
  data() {
    return {
      dataForm: {
        codeType: '',
        codeTypeName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tableHeight: null
    };
  },
  components: {
    addOrUpdate
  },
  activated() {
    this.getDataList();
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 300;
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
      API.data.dictionary.list(params).then(({ data }) => {
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
      var dataIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.dataId;
          });
      this.$confirm(`确定对[id=${dataIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.data.dictionary.del(dataIds).then(({ data }) => {
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
