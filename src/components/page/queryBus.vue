<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>业务查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.name" placeholder="服务名称" class="handle-input mr10"></el-input>
                <el-input v-model="search.priceFrom" placeholder="服务价格从" class="handle-input mr10"></el-input>
                <el-input v-model="search.priceTo" placeholder="服务价格至" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    
            >
                <el-table-column prop="businessType" align="center" label="服务类别"></el-table-column>
                <el-table-column prop="businessName" align="center" label="服务名称"></el-table-column>
                <el-table-column prop="businessTime" align="center" label="服务时长(小时计)"></el-table-column>
                <el-table-column prop="businessPrice" align="center" label="服务价格"></el-table-column>
                <el-table-column label="预约"  align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAdd(scope.$index, scope.row)"
                        >预约
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

        <!-- 新增弹出框 -->
        <el-dialog
        title="预约新增"
        :visible.sync="addVisible"
        width="30%"
        >
        <el-form label-width="100px">
            <el-form-item label="业务" >
                <el-col :span="19">
                <p>{{addForm.businessName}}</p>
                </el-col>
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
    export default {
        name: 'basetable',
        data() {
            return {
                currentPage:0,
                tableData:[],
                pageSize:5,
                total:0,
                search: {
                    name:"",
                    priceFrom:"",
                    priceTo:""
                   
                },
                addVisible:false,
                addForm:{                        // 新增表单
                    businessId:"",
                    businessName:"",
                    barberId:"",
                    taskStart:"",
                },
                barberList:[],
            };
        },
        created() {
            const _this = this;
            axios.get('/api/business/data/query'
            +'?page=1&size=5'
            +'&businessName='+_this.search.name
            +'&priceFrom='+_this.search.priceFrom
            +'&priceTo='+_this.search.priceTo).then(function(resp){
            console.log(resp.data.extend.pageInfo);
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
            })
        },
        methods: {
            
            
            // 触发搜索按钮
            handleSearch() {
                const _this = this;
                this.page(this.currentPage);
            },
           
            page(currentPage){
                const _this = this;
               
                axios.get('/api/business/data/query'
                +'?page='+currentPage+'&size=5'
                +'&businessName='+_this.search.name
                +'&priceFrom='+_this.search.priceFrom
                +'&priceTo='+_this.search.priceTo).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.currentPage = pageInfo.pageNum;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                })
            },
            handleAdd(index, row) {
                const _this = this;
                _this.addVisible = true;
                _this.addForm.id = null;
                _this.addForm.businessName = row.businessName;
                _this.addForm.businessId = row.id;
                axios.get('/api/skill/query/by/businessId?id='+_this.addForm.businessId
                ).then(function(resp){
                    _this.barberList.length = 0; 
                    var temp = resp.data.extend.skill;
                    var i = 0;
                    
                    for (i = 0; i < temp.length; i++) { 
                        var barber = {id:temp[i].barberId, name:temp[i].barberName};
                        _this.barberList.push(barber);
                    }   
                });
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
