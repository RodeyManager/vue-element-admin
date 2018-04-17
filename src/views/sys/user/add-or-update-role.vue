<template>
  <el-dialog
    title="分配角色"
    class="el-dialog-cstm"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="角色列表" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from '@/api';

export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      user: null,
      dataForm: {
        roleIdList: []
      }
    };
  },
  methods: {
    init(user) {
      this.user = user;
      this.dataForm.id = user.userId || 0;
      API.sys.role
        .select()
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            API.sys.user.info(this.dataForm.id).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.roleIdList = data.user.roleIdList;
              }
            });
          }
        });
    },
    // 表单提交
    dataFormSubmit() {
      let params = {
        userId: this.dataForm.id,
        roleIdList: this.dataForm.roleIdList,
        email: this.user.email,
        username: this.user.username
      };
      params.roleIdList = this.dataForm.roleIdList;
      const tick = API.sys.user.update(params);
      tick.then(({ data }) => {
        if (data && data.code === 0) {
          this.visible = false;
          this.$emit('refreshDataList');
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1200
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog-cstm {
  .el-checkbox-group {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    .el-checkbox {
      margin-left: 10px;
      flex-grow: 1;
    }
  }
}
</style>
