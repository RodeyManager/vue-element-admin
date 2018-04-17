<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:menu:list')" type="primary" :icon="isExpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="switchExpandAll()">{{ isExpandAll ? '全部收起' : '全部展开' }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      :max-height="tableHeight"
      v-loading="dataListLoading"
      border
      ref="table"
      style="width: 100%;">
      <el-table-column
        fixed
        prop="menuId"
        header-align="center"
        align="center"
        width="50"
        label="ID">
      </el-table-column>
      <table-tree-column
        v-if="!isExpandAll"
        prop="name"
        header-align="center"
        treeKey="menuId"
        width="250"
        label="名称">
      </table-tree-column>
      <el-table-column
        v-else
        prop="name"
        header-align="center"
        align="left"
        width="250"
        label="名称">
        <template slot-scope="scope">
          <span :style="{ 'padding-left': scope.row.paddingLeft }">
            <i :class="scope.row.iconExpand" :style="{ visible: scope.row.visible }"></i>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="250"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        prop="icon"
        header-align="center"
        align="center"
        width="60"
        label="图标">
        <template slot-scope="scope">
          <i :class="['fa-lg', scope.row.icon]"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="250"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="250"
        :show-overflow-tooltip="true"
        label="授权标识">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button v-if="isAuth('sys:user:update')" type="primary" icon="el-icon-edit" plain circle size="mini" @click="addOrUpdateHandle(scope.row.menuId)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-if="isAuth('sys:user:delete')" type="danger" icon="el-icon-delete" plain circle size="mini" @click="deleteHandle(scope.row.menuId)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column';
import AddOrUpdate from './add-or-update';
import API from '@/api';
import { treeDataTranslate, treeDataTranslateExpandAll } from '@/utils';
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      rawDataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      isExpandAll: false,
      tableHeight: 100
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.documentElement.clientHeight - 300;
    });
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      API.sys.menu.list().then(({ data }) => {
        this.dataListExpandAll = treeDataTranslateExpandAll(data, 'menuId');
        this.dataListExpandAllNo = treeDataTranslate(data, 'menuId');
        this.dataList = this.dataListExpandAllNo;
        this.dataListLoading = false;
      });
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
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.sys.menu.del(id).then(({ data }) => {
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
    },
    // 全部展开/收起
    switchExpandAll() {
      this.isExpandAll = !this.isExpandAll;
      this.dataList = this.isExpandAll ? this.dataListExpandAll : this.dataListExpandAllNo;
    }
  }
};
</script>
