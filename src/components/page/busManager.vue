<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>业务管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.businessName" placeholder="业务名称" class="handle-input mr10"></el-input>
                <el-select v-model="search.businessType" placeholder="类别" class="handle-input mr10" >
                    <el-option
                    v-for="type in searchTypes"
                    :key="type"
                    :label="type"
                    :value="type">
                    </el-option>
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
                <el-table-column prop="businessType" align="center" label="类别"></el-table-column>
                <el-table-column prop="businessName" align="center" label="名称"></el-table-column>
                <el-table-column prop="businessPrice" align="center" label="价格"></el-table-column>
                <el-table-column prop="businessTime" align="center" label="时长（小时计）"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                class="red"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
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
        title="业务编辑"
        :visible.sync="editVisible"
        width="30%"
        >
            <el-form  ref="editForm" :model="editForm" label-width="100px">
                
                <el-form-item label="名称" prop="name" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="editForm.name"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="价格" prop="price" :rules="rules.numPot2" >
                    <el-col :span="20">
                        <el-input v-model="editForm.price"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="时长" prop="time":rules="rules.numPot2" >
                    <el-col :span="20">
                        <el-input v-model="editForm.time"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="类别" prop="type" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="editForm.type"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog
        title="业务新增"
        :visible.sync="addVisible"
        width="30%"
        >
            <el-form  ref="addForm" :model="addForm" label-width="100px">
                <el-form-item label="名称"  prop="name" :rules="rules.text">
                <el-col :span="20">
                    <el-input v-model="addForm.name" prop="name" ></el-input>
                </el-col>
                </el-form-item>
                <el-form-item label="价格" prop="price" :rules="rules.numPot2">
                <el-col :span="20">
                    <el-input v-model="addForm.price" ></el-input>
                </el-col>
                </el-form-item>
                <el-form-item label="时长" prop="time" :rules="rules.numPot2">
                <el-col :span="20">
                    <el-input v-model="addForm.time"></el-input>
                </el-col>
                </el-form-item>
                <el-form-item label="类别" prop="type" :rules="rules.text">
                    <el-col :span="20">
                        <el-input v-model="addForm.type"></el-input>
                    </el-col>
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
                currentPage:0,                  // 当前界面
                searchTypes:"",                  // 当前类别（搜索用）
                search: {                        // 搜索条件
                    businessName:"",
                    businessType:"",
                },
                editVisible: false,              // 编辑显示
                addVisible: false,               // 新增显示
                editForm:{                       // 编辑表单
                    id:"",
                    name:"",
                    price:"",
                    time:"",
                    type:"",
                },
                addForm:{                        // 新增表单
                    name:"",
                    price:"",
                    time:"",
                    type:"",
                },
                userName:"",
               // currentBusinessType:"",           // 当前类别（编辑用）
               // businessTypeList:[],             // 类别列表（编辑用）

            };
        },
        created() {
            let userName = sessionStorage.getItem('loginName');
            this.userName = userName;   
            const _this = this;
            axios.get('/api/business/data/query'
            +'?page=1&size=5'
            +'&businessName='+_this.search.businessName
            +'&userName='+_this.userName).then(function(resp){ 
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
            console.log(pageInfo);
            });
            _this.getTypes();
           
        },
        methods: {
           
            // 触发搜索按钮
            handleSearch() {
            
                const _this = this;
                this.page(0);
            },
            handleDelete(index, row) {
                const _this = this;
                axios.delete('/api/business/' + row.id+"?userName="+_this.userName
                ).then(function(resp){
                    if(resp.data.code == 200) {
                        _this.$message.success('删除成功');
                        _this.total = _this.total - 1;
                        if(_this.total % _this.pageSize == 1) {
                            _this.page(_this.currentPage - 1);
                        } else {
                            _this.page(_this.currentPage);
                        }
                        _this.getTypes();
                    } else{
                        _this.$message.error('该业务仍有预约任务，不允许删除');
                    }
                });
            },
            
            page(currentPage){
              
                const _this = this;
                axios.defaults.withCredentials = true;
                axios.get('/api/business/data/query'
                +'?page='+ currentPage +'&size=5'
                +'&businessName='+_this.search.businessName
                +'&businessType='+_this.search.businessType
                ).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
                })
            },
            getTypes() {
                const _this = this;
                axios.get('/api/business/types'
                ).then(function(resp){ 
                var types = resp.data.extend.types;
                _this.searchTypes = types;
                _this.searchTypes.push("");
                })
            },
            handleEdit(index, row){
                const _this = this;
                _this.editVisible = true;
                _this.editForm.id = row.id;
                _this.editForm.name = row.businessName;
                _this.editForm.price = row.businessPrice;
                _this.editForm.time = row.businessTime;
                _this.editForm.type = row.businessType;
               
            },
            handleAdd() {
                const _this = this;
                _this.addVisible = true;
                _this.addForm.id = null;
                _this.addForm.name = "";
                _this.addForm.price = "";
                _this.addForm.time = "";
                _this.addForm.type = "";
            },
            saveEdit(){
                const _this = this;
                axios.put('http://127.0.0.1:8081/api/business', 
                {
                    "id":_this.editForm.id,
                    "businessType":_this.editForm.type,
                    "businessName":_this.editForm.name,         
                    "businessPrice":_this.editForm.price,         
                    "businessTime":_this.editForm.time,         
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.editVisible = false;
                        _this.page(_this.currentPage);
                        _this.$message.success('修改成功');
                        _this.getTypes();
                    } else {
                        _this.$message.error('修改失败');
                    }
                })
            },
            saveAdd(){
            
                const _this = this;
                axios.post('http://127.0.0.1:8081/api/business', 
                {      
                    "businessType":_this.addForm.type,
                    "businessName":_this.addForm.name,         
                    "businessPrice":_this.addForm.price,         
                    "businessTime":_this.addForm.time,         
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.addVisible = false;
                        _this.page(_this.currentPage);
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
