<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.userName" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-select v-model="search.gender" placeholder="性别" class="handle-input mr10" >
                    <el-option :key="1"  value="1" label="男"></el-option>
                    <el-option :key="2"  value="2" label="女"></el-option>
                    <el-option :key="3"  value="" label="男  /  女"></el-option>
                </el-select> 
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                <el-table-column prop="gender" align="center" label="性别"></el-table-column>
                <el-table-column prop="phone" align="center" label="手机"></el-table-column>
                <el-table-column prop="userPassword" align="center" label="密码"></el-table-column>
                <el-table-column prop="isDeleted" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isDeleted == 0">启用</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.isDeleted == 1">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="1"
                        :page-size="pageSize"
                        :total="total"
                        @current-change="page"
                ></el-pagination>
            </div>
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog
        title="员工编辑"
        :visible.sync="editVisible"
        width="30%"
        >
            <el-form  ref="editForm" :model="editForm" label-width="100px">
                
                <el-form-item label="姓名" prop="userName" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="editForm.userName"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="editForm.userPassword"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机" prop="phone" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="editForm.phone"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                    style="display: block"
                    v-model="editForm.isDeleted"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="禁用">
                    </el-switch>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog
        title="员工新增"
        :visible.sync="addVisible"
        width="30%"
        >
        <el-form ref="regist" :model="addForm"  label-width="80px" >
            <el-form-item label="员工名"  prop="userName" :rules="rules.name" >
              <el-col :span="20">
                <el-input v-model="addForm.userName" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="员工密码" prop="userPassword" :rules="rules.password">
              <el-col :span="20">
                <el-input v-model="addForm.userPassword" ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="员工手机" prop="phone" :rules="rules.phone">
              <el-col :span="20">
                <el-input v-model="addForm.phone"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="员工性别" prop="gender">
              <el-radio-group v-model="addForm.gender">
                <el-radio label="1" >男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-form>
            
        <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveAdd()">确 定</el-button>
        </span>
        </el-dialog>
       
    </div>
</template>

<script>
    import axios from '../../utils/_axios'
    import rules from '../../utils/rule'
    export default {
        data() {
            return {
                rules,
                tableData:[],                    // 查询的数据
                pageSize:5,                      // 页面大小
                total:11,                        // 总数
                currentPage:"",                  // 当前界面
                searchTypes:"",                  // 当前类别（搜索用）
                search: {                        // 搜索条件
                    userName:"",
                    gender:"",
                },
                editVisible: false,              // 编辑显示
                addVisible: false,               // 新增显示
                editForm:{                       // 编辑表单
                    id:"",
                    userName:"",
                    userPassword:"",
                    phone:"",
                    isDeleted:"",
                },
                addForm:{                        // 新增表单
                    userName:"",
                    userPassword:"",
                    gender:"",
                    phone:"",
                },
               // currentBusinessType:"",           // 当前类别（编辑用）
               // businessTypeList:[],             // 类别列表（编辑用）

            };
        },
        created() {
            const _this = this;
            
            axios.get('/user/data/query?page=1&size=5&roleId=2'
            // axios.get('/api/user/data/query'
            // +'?page=1&size=5'
            // +'&userName='+_this.search.userName
            // +'&gender='+_this.search.gender
           ).then(function(resp){        
            var pageInfo = resp.data.extend.pageInfo;
            var i = 0;               
            _this.tableData = pageInfo.list;
            _this.transGender();
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
           
            });
            
        },
        methods: {
           
            // 触发搜索按钮
            handleSearch() {
                this.page(1);
            },
            handleDelete(index, row) {
                const _this = this;
                axios.delete('/api/business/' + row.id
                ).then(function(resp){
                    _this.$message.success('删除成功');
                    if(_this.total % _this.pageSize == 1) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }
                  
                });
            },
            
            page(currentPage){   
              
                const _this = this;
                axios.get('/user/data/query'
                +'?page='+currentPage+'&size=5'
                +'&userName='+_this.search.userName
                +'&gender='+_this.search.gender
                +'&roleId=2'
                ).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
               
                _this.transGender();
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
                })
            },
            transGender(){
                var i = 0;
                for (i = 0; i < this.tableData.length; i++) { 
                    if(this.tableData[i].gender == 1)
                    this.tableData[i].gender = '男';
                    if(this.tableData[i].gender == 2)
                    this.tableData[i].gender = '女';
                }
            
            },
           
            handleEdit(index, row){    
                const _this = this;
                _this.editVisible = true;
                _this.editForm.id = row.userId;
                _this.editForm.userName = row.userName;
                _this.editForm.userPassword = row.userPassword;
                _this.editForm.phone = row.phone;
                _this.editForm.isDeleted = row.isDeleted == 0 ? true : false;
               
            },
            handleAdd() {
                const _this = this;
                _this.addVisible = true;
                _this.addForm.id = null;
                _this.addForm.userName = "";
                _this.addForm.userPassword = "";
                _this.addForm.gender = "";
                _this.addForm.phone = "";
            },
            saveEdit(){
                const _this = this;
                axios.put('/user',
                {
                    "userId":_this.editForm.id,
                    "userName":_this.editForm.userName,
                    "userPassword":_this.editForm.userPassword,         
                    "phone":_this.editForm.phone,         
                    "isDeleted":_this.editForm.isDeleted == true ? 0 : 1,         
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.editVisible = false;
                        _this.page(_this.currentPage);
                        _this.$message.success('修改成功');
                        _this.getTypes();
                    } else {
                        _this.$message.error(response.data.extend.msg);
                    }
                })
            },
            saveAdd(){
            
                const _this = this;
                axios.post('http://127.0.0.1:8081/api/add/user', 
                {      
                    "userName":_this.addForm.userName,
                    "userPassword":_this.addForm.userPassword,
                    "phone":_this.addForm.phone,
                    "gender":_this.addForm.gender,
                    "roleId":2      
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.addVisible = false;
                        _this.page(1);
                        _this.$message.success('添加成功');
                        _this.getTypes();
                    } else {
                        _this.addVisible = false;
                        _this.$message.error('添加失败');
                    }
                })
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
