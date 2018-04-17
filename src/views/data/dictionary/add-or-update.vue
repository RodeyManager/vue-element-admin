<template>
  <el-dialog
    width="30%"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" status-icon>
      <el-form-item label="数据字典" prop="codeType">
        <el-input v-model="dataForm.codeType" placeholder="数据字典"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="codeTypeName">
        <el-input v-model="dataForm.codeTypeName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="字典编码"></el-input>
      </el-form-item>
      <el-form-item label="字典编码名" prop="codeName">
        <el-input v-model="dataForm.codeName" placeholder="字典编码名"></el-input>
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
    return {
      visible: false,
      dataForm: {
        dataId: 0,
        codeType: '',
        codeTypeName: '',
        code: '',
        codeName: ''
      },
      dataRule: {
        codeType: [
          { required: true, message: '数据字典不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z][a-zA-Z0-9_]+$/, message: '数据字典只能为字母开头，且只能包括字母,数字,下划线', trigger: 'blur' }
        ],
        codeTypeName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }],
        codeName: [{ required: true, message: '字典编码名不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.dataId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.dataId) {
          API.config.info(this.dataForm.dataId).then(({ data }) => {
            if (data && data.code === 0) {
              Object.keys(data.config).map(key => {
                key in this.dataForm && (this.dataForm[key] = data.config[key]);
              });
              // this.dataForm.codeType = data.config.codeType;
              // this.dataForm.codeTypeName = data.config.codeTypeName;
              // this.dataForm.code = data.config.code;
              // this.dataForm.codeName = data.config.codeName;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          var params = {
            dataId: this.dataForm.dataId || undefined,
            codeType: this.dataForm.codeType,
            codeTypeName: this.dataForm.codeTypeName,
            code: this.dataForm.code,
            codeName: this.dataForm.codeName
          };
          var tick = !this.dataForm.dataId ? API.config.add(params) : API.config.update(params);
          tick.then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
