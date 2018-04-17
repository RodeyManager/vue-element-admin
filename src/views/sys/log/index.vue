<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        fixed
        prop="username"
        header-align="center"
        align="center"
        width="120"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        width="120"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="请求方法">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        width="120"
        label="执行时长(毫秒)">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        sortable
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-form class="table-bottom-wrapper">
      <el-form-item>

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
  </div>
</template>

<script>
import API from '@/api';
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
      selectionDataList: [],
      tableHeight: null
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      console.log(this.pageSize);
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.dataForm.key
      };
      API.sys.log.list(params).then(({ data }) => {
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
    }
  }
};
</script>
