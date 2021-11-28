<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>技能分配
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.barberName" placeholder="理发师" class="handle-input mr10"></el-input>
                <el-input v-model="search.businessName" placeholder="业务" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="handleInput">导入</el-button>
                <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                 
            >
                <el-table-column prop="barberName" align="center" label="理发师"></el-table-column>
                <el-table-column prop="businessName" align="center" label="业务"></el-table-column>
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
        title="技能编辑"
        :visible.sync=" editVisible"
        width="30%"
        >
            <el-form ref="skillInfo"  label-width="100px">
                <el-form-item label="理发师" >
                    <el-select v-model="currentBarberId" placeholder="请选择" >
                        <el-option
                        v-for="barber in barberList"
                        :key="barber.id"
                        :label="barber.name"
                        :value="barber.id">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="业务" >
                    <el-select v-model="currentBusinessId" placeholder="请选择" >
                        <el-option
                        v-for="business in businessList"
                        :key="business.id"
                        :label="business.name"
                        :value="business.id">
                        </el-option>
                    </el-select>
                </el-form-item>              
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog
        title="技能新增"
        :visible.sync=" addVisible"
        width="30%"
        >
            <el-form label-width="100px">
                <el-form-item label="理发师" >
                    <el-select v-model="currentBarberId" placeholder="请选择" >
                        <el-option
                        v-for="barber in barberList"
                        :key="barber.id"
                        :label="barber.name"
                        :value="barber.id">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="业务" >
                    <el-select v-model="currentBusinessId" placeholder="请选择" >
                        <el-option
                        v-for="business in businessList"
                        :key="business.id"
                        :label="business.name"
                        :value="business.id">
                        </el-option>
                    </el-select>
                </el-form-item>              
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
        title="批量导入"
        :visible.sync=" inputVisible"
        width="30%"
        >
        <el-form  label-width="100px" id="myForm" name="myForm" method="post" enctype="multipart/form-data"
        action="/api/skill/import/new"  >
            <el-form-item label="文件"  >
            <el-col :span="20">
                <!-- <el-input  type="file" id="myFile" v-model="file" ></el-input> -->
                <input type="file" id="file" name="file">
            </el-col>
           
            </el-form-item>
            <el-form-item>
            <button type="button" v-on:click="downloadTemplate()" >下载模板</button>
            <button type="button" v-on:click="submitForm"  style="margin-left: 80px;">&nbsp;导&nbsp;&nbsp;&nbsp;&nbsp;入&nbsp;</button>
            
            </el-form-item>
            
           
        </el-form>
        
            
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInput($event)">确 定</el-button>
            </span> -->
        </el-dialog>
       
    </div>
</template>

<script>
    import axios from '../../utils/_axios'
    export default {
        data() {
            return {
                tableData:[],                    // 查询的数据
                pageSize:5,                      // 页面大小
                total:11,                        // 总数
                currentPage:"",                  // 当前界面
                isLastPage:false,
                search: {                        // 搜索条件
                    businessName:"",
                    barberName:""
                },
                editVisible: false,              // 编辑显示
                barberList:[],                   // 理发师列表
                businessList:[],                 // 业务列表
                currentBarberId:"",              // 当前理发师id
                currentBusinessId:"",            // 当前业务id
                currentSkillId:"",               // 当前技能id
                addVisible: false,               // 新增显示
                inputVisible: false,             // 导入显示
                file:"",                          // 导入文件
               
            };
        },
        created() {
            const _this = this;
            axios.get('/api/skill/data/query'
            +'?page=1&size=5'
            +'&businessName='+_this.search.businessName
            +'&barberName='+_this.search.barberName).then(function(resp){ 
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
            console.log(pageInfo);
            })
        },
        methods: {
           
            // 触发搜索按钮
            handleSearch() {
                const _this = this;
                this.page(1)
            },
            handleDelete(index, row) {
                const _this = this;
                axios.delete('/api/skill/' + row.id
                ).then(function(resp){
                    _this.$message.success('删除成功');
                    _this.total = _this.total - 1;
                      
                    if(_this.isLastPage == true && _this.total % _this.pageSize == 0) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }

                });
            },
           
            page(currentPage){
                const _this = this;
                var lastFlag = 0;
                axios.get('/api/skill/data/query'
                +'?page='+ currentPage +'&size=5'
                +'&businessName='+_this.search.businessName
                +'&barberName='+_this.search.barberName).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
                _this.isLastPage = pageInfo.isLastPage;
                console.log(pageInfo.isLastPage)
                   
                })
            },
            handleEdit(index, row){
                const _this = this;
                _this.editVisible = true;
                _this.currentSkillId = row.id;
                axios.get('/api/user/query/barber?userName='+row.barberName
                ).then(function(resp){
                    var temp = resp.data.extend.barbers[0];
                    _this.currentBarberId = temp.userId;
                });
                axios.get('/api/user/query/barber'
                ).then(function(resp){
                    _this.barberList.length = 0;
                    var temp = resp.data.extend.barbers;
                    var i = 0;
                    for (i = 0; i < temp.length; i++) { 
                        var barber = {id:temp[i].userId, name:temp[i].userName};
                        _this.barberList.push(barber);
                    }                 
                });
                axios.get('/api/business/'+row.businessId
                ).then(function(resp){
                   
                    var temp = resp.data.extend.business;
                    _this.currentBusinessId = temp.id;
                });
                axios.get('/api/business/data/query?page=1&size=999'
                ).then(function(resp){
                   
                    _this.businessList.length = 0;
                    var temp = resp.data.extend.pageInfo.list;
                    console.log(temp);
                    var i = 0;
                    for (i = 0; i < temp.length; i++) { 
                        var business = {id:temp[i].id, name:temp[i].businessName};
                        _this.businessList.push(business);
                    }   
                });
            },
            handleAdd() {
                const _this = this;
                _this.addVisible = true;
                _this.currentBarberId = "";
                _this.currentBusinessId = "";
                axios.get('/api/user/query/barber'
                ).then(function(resp){
                    _this.barberList.length = 0;
                    var temp = resp.data.extend.barbers;
                    var i = 0;
                    for (i = 0; i < temp.length; i++) { 
                        var barber = {id:temp[i].userId, name:temp[i].userName};
                        _this.barberList.push(barber);
                    }                 
                });
                axios.get('/api/business/data/query?page=1&size=999'
                ).then(function(resp){
                    _this.businessList.length = 0;
                    var temp = resp.data.extend.pageInfo.list;
                    var i = 0;
                    for (i = 0; i < temp.length; i++) { 
                        var business = {id:temp[i].id, name:temp[i].businessName};
                        _this.businessList.push(business);
                    }   
                });
            },
            saveEdit(){
                const _this = this;
                axios.put('http://127.0.0.1:8081/api/skill', 
                {
                    "id":_this.currentSkillId,
                    "barberId":_this.currentBarberId,
                    "businessId":_this.currentBusinessId,         
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.editVisible = false;
                        _this.page(1);
                        _this.$message.success('修改成功');
                        //window.location.reload();
                    } else {
                        _this.$message.error('技能定义重复');
                    }
                })
            },
            saveAdd(){
                const _this = this;
                axios.post('http://127.0.0.1:8081/api/skill', 
                {
                    //"id":_this.currentSkillId,
                    "barberId":_this.currentBarberId,
                    "businessId":_this.currentBusinessId,         
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.editVisible = false;
                        _this.$message.success('添加成功');
                        _this.addVisible = false;
                        _this.page(_this.currentPage);
                    //    window.location.reload();
                    } else {
                        _this.$message.error('技能定义重复');
                        _this.addVisible = false;
                    }
                })
            },
            handleInput(){
                const _this = this;
                _this.inputVisible = true;
               // window.open("/api/skill/template");
               
               /* axios.get('/api/skill/template'
                ).then(function(resp){
                             
                });*/
               
            },
           
            handleExport() {
               window.open("/api/skill/export/data?"
               +'barberName='+this.search.barberName+'&businessName='+this.search.businessName);

            },

            downloadTemplate(){
                window.open("/api/skill/template");
            },
            submitForm() {
                 var file = document.getElementById("file").value;
                 var myForm = document.getElementById("myForm");
                 if(file == "") {
                    this.$message.error('未选择文件');
                 } else {
                    myForm.submit();
                 }
             
            },
             saveInput(event){
               console.log(event);
                event.preventDefault();
                let param = new FormData(); 
                param.append("file",this.file);
                let config = {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }
                console.log(param.get("file"));
                const _this = this;
                axios.post(	
                '/api/skill/import/new',
                param,
                config
                ).then(function (response) {
                    console.log(response);
              
                })
                .catch(function (error) {
                    console.log(error);
                });
               
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
