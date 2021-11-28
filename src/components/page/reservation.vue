<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>预约查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.customerName" placeholder="顾客名" class="handle-input mr10"></el-input>
                <el-input  v-model="search.businessName" placeholder="业务名" class="handle-input mr10"></el-input>
                <el-input v-model="search.barberName" placeholder="理发师" class="handle-input mr10"></el-input>
                <el-date-picker v-model="search.dateStart" placeholder="预约时间从" class="handle-input-date mr10""></el-date-picker>
                <el-date-picker v-model="search.dateEnd" placeholder="预约时间至" class="handle-input-date mr10""></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd"
                >预约
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                
            >
            <el-table-column prop="businessName" align="center" label="服务名称"></el-table-column>
            <el-table-column prop="customerName" align="center" label="顾客名称"></el-table-column>
            <el-table-column prop="barberName" align="center" label="预约理发师"></el-table-column>
            <el-table-column prop="taskStart" align="center" label="开始时间"></el-table-column>
            <el-table-column prop="taskEnd" align="center" label="结束时间"></el-table-column>
           
                <el-table-column label="操作" width="180" align="center" v-if="roleId==1">
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
                        <el-button
                                type="text"
                              
                                icon="el-icon-warning"
                                @click="handleBreak(scope.$index, scope.row)"
                        >违约
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
        title="预约编辑"
        :visible.sync="editVisible"
        width="30%"
        >
        <el-form label-width="100px">
            <el-form-item label="业务" >
                <el-select v-model="editForm.businessId" placeholder="请选择" @change="getBarber(editForm.businessId)">
                    <el-option
                    v-for="business in businessList"
                    :key="business.id"
                    :label="business.name"
                    :value="business.id">
                    </el-option>
                </el-select>
            </el-form-item>   
            <el-form-item label="理发师" >
                <el-select v-model="editForm.barberId" placeholder="请选择" >
                    <el-option
                    v-for="barber in barberList"
                    :key="barber.id"
                    :label="barber.name"
                    :value="barber.id">
                    </el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="预约时间">
                
                  <el-date-picker type="datetime"
                  v-model="editForm.taskStart"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间">
                  </el-date-picker>
              </el-form-item>
                      
        </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog
        title="预约新增"
        :visible.sync="addVisible"
        width="30%"
        >
        <el-form label-width="100px">
            <el-form-item label="业务" >
                <el-select v-model="addForm.businessId" placeholder="请选择" @change="getBarber(addForm.businessId)">
                    <el-option
                    v-for="business in businessList"
                    :key="business.id"
                    :label="business.name"
                    :value="business.id">
                    </el-option>
                </el-select>
            </el-form-item>   
            <el-form-item label="理发师" >
                <el-select v-model="addForm.barberId" placeholder="请选择" >
                    <el-option
                    v-for="barber in barberList"
                    :key="barber.id"
                    :label="barber.name"
                    :value="barber.id">
                    </el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="预约时间">
                
                  <el-date-picker type="datetime"
                  v-model="addForm.taskStart"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间">
                  </el-date-picker>
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
                total:0,                        // 总数
                currentPage:"",                  // 当前界面
                searchTypes:"",                  // 当前类别（搜索用）
                search: {                        // 搜索条件
                    businessName:"",
                    barberName:"",
                    customerName:"",
                    dateStart:"",
                    dateEnd:""
                },
                editVisible: false,              // 编辑显示
                addVisible: false,               // 新增显示
                editForm:{                       // 编辑表单
                    businessId:"",
                    businessName:"",
                    barberId:"",
                    taskStart:"",
                    customerId:"",
                },
                addForm:{                        // 新增表单
                    businessId:"",
                    businessName:"",
                    barberId:"",
                    taskStart:"",
                },
                businessList:[],                  // 业务列表(新增)
                barberList:[],                    // 理发师列表(新增)
              
                userId:"",
                roleId:"",
               // currentBusinessType:"",           // 当前类别（编辑用）
               // businessTypeList:[],             // 类别列表（编辑用）

            };
        },
        created() {
            const _this = this;
            axios.get('/api/task/data/query'
            +'?page=1&size=5'
            ).then(function(resp){ 
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
            console.log(pageInfo);
            });
            this.roleId = sessionStorage.getItem('loginRole');
        },
        methods: {
           
            // 触发搜索按钮
            handleSearch() {
                const _this = this;
                this.page(this.currentPage);
            },
            handleDelete(index, row) {
             
                const _this = this;
                var roleId = sessionStorage.getItem('loginRole');
                axios.post('http://127.0.0.1:8081/api/task/cancel', 
                {      
                   "taskId":row.id,
                    "roleId":roleId
                }).then(function (response) {
                    _this.$message.success('删除成功');
                    if(_this.total % _this.pageSize == 1) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }
                   
                });
            },
            handleBreak(index, row) {
             
             const _this = this;
            
             axios.post('http://127.0.0.1:8081/api/task/cancel', 
             {      
                "taskId":row.id,
                 "roleId":3
             }).then(function (response) {
                 _this.$message.success('记录成功');
                 if(_this.total % _this.pageSize == 1) {
                     _this.page(_this.currentPage - 1);
                 } else {
                     _this.page(_this.currentPage);
                 }
                
             });
            },
            page(currentPage){
                const moment = require('moment')
                var start = moment(this.search.dateStart).format('YYYY-MM-DD');
                var end = moment(this.search.dateEnd).format('YYYY-MM-DD');
               
                const _this = this;
    
                axios.get('/api/task/data/query'
                +'?page='+ currentPage +'&size=5'
                +'&businessName='+_this.search.businessName
                +'&barberName='+_this.search.barberName
                +'&customerName='+_this.search.customerName
                +'&dateStart='+ start
                +'&dateEnd='+ end
                ).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
                })
            },
           
            handleEdit(index, row){
                const _this = this;
                _this.editVisible = true;
                _this.editForm.id = row.id;
                _this.editForm.barberId = row.barberId;
                _this.editForm.businessId = row.businessId;
                _this.editForm.businessName = row.businessName;
                _this.editForm.customerId = row.customerId;
                _this.editForm.taskStart = row.taskStart;

                axios.get('/api/business/data/query?page=1&size=999'
                ).then(function(resp){
                    _this.businessList.length = 0;
                    var temp = resp.data.extend.pageInfo.list;
                    var i = 0;
                  
                    for (i = 0; i < temp.length; i++) { 
                        var business = {id:temp[i].id, name:temp[i].businessName};
                        _this.businessList.push(business);
                    }  
                   
                    axios.get('/api/skill/query/by/businessId?id='+_this.editForm.businessId
                    ).then(function(resp){
                        _this.barberList.length = 0; 
                        var temp = resp.data.extend.skill;
                        var i = 0;
                        
                        for (i = 0; i < temp.length; i++) { 
                            var barber = {id:temp[i].barberId, name:temp[i].barberName};
                            _this.barberList.push(barber);
                        }   
                    });

                });
               
               
               
            },
            handleAdd() {
                const _this = this;
                _this.addVisible = true;
                _this.addForm.id = null;
    
                axios.get('/api/business/data/query?page=1&size=999'
                ).then(function(resp){
                    _this.businessList.length = 0;
                    var temp = resp.data.extend.pageInfo.list;
                    var i = 0;
                    _this.addForm.businessId = temp[i].id;
                    _this.addForm.businessName = temp[i].businessName;
                  
                    for (i = 0; i < temp.length; i++) { 
                        var business = {id:temp[i].id, name:temp[i].businessName};
                        _this.businessList.push(business);
                    }   
                    axios.get('/api/skill/data/query?page=1&size=999'
                    +'&businessName='+_this.addForm.businessName
                    ).then(function(resp){
                        _this.barberList.length = 0;
                        var temp = resp.data.extend.pageInfo.list;
                        var i = 0;
                        _this.addForm.barberId = temp[i].barberId;
                        for (i = 0; i < temp.length; i++) { 
                            var barber = {id:temp[i].barberId, name:temp[i].barberName};
                            _this.barberList.push(barber);
                        }   
                    });

                });
               
               
            },
            saveEdit(){
              
                const _this = this;
                axios.put('http://127.0.0.1:8081/api/task', 
                {
                    "id":_this.editForm.id,
                    "taskStart":_this.editForm.taskStart,
                    "businessId":_this.editForm.businessId,
                    "barberId":_this.editForm.barberId,
                    "customerId":_this.editForm.customerId        
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.editVisible = false;
                        _this.page(_this.currentPage);
                        _this.$message.success('修改成功');
                       
                    } else {
                        _this.$message.error(response.data.extend.error);
                    }
                })
            },
            saveAdd(){
                this.userId = sessionStorage.getItem('userId');
                var date = new Date(this.addForm.taskStart);
                const moment = require('moment')
                var start = moment(this.addForm.taskStart).format('YYYY-MM-DD HH-mm-ss');
                
                const _this = this;
                axios.post('http://127.0.0.1:8081/api/task', 
                {      
                    "id":"",
                    "taskStart":_this.addForm.taskStart,
                    "businessId":_this.addForm.businessId,
                    "barberId":_this.addForm.barberId,
                    "customerId":_this.userId    
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.addVisible = false;
                        _this.page(_this.currentPage);
                        _this.$message.success('预约成功');
                    } else {
                        _this.addVisible = false;
                        _this.$message.error(response.data.extend.error);
                    }
                })
            },
            getBarber(id) {
                const _this = this;
                axios.get('/api/skill/query/by/businessId?id='+id
                ).then(function(resp){
                    _this.barberList.length = 0; 
                    var temp = resp.data.extend.skill;
                    var i = 0;
                    _this.addForm.barberId = temp[i].barberId;
                    _this.editForm.barberId = temp[i].barberId;
                    for (i = 0; i < temp.length; i++) { 
                        var barber = {id:temp[i].barberId, name:temp[i].barberName};
                        _this.barberList.push(barber);
                    }   
                });

                
            }
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
        width: 100px;
        display: inline-block;
    }
    .handle-input-date {
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
