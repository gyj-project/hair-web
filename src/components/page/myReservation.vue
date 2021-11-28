  <template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>预约信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
       
            <div class="handle-box">

            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    
            >
               
                <el-table-column prop="businessName" align="center" label="服务名称"></el-table-column>
                <el-table-column prop="customerName" align="center" label="顾客"v-if="roleId==2"></el-table-column>
                <el-table-column prop="barberName" align="center" label="理发师"v-if="roleId==3"></el-table-column>
                <el-table-column prop="businessPrice" align="center" label="价格"></el-table-column>
                <el-table-column prop="createdTime" align="center" label="下单时间"></el-table-column>
                <el-table-column prop="taskStart" align="center" label="开始时间"></el-table-column>
                <el-table-column prop="taskEnd" align="center" label="结束时间"></el-table-column>
                
             
                <el-table-column label="操作" width="180" align="center" v-if="roleId==3">
                    <template slot-scope="scope">
                   
                        <el-button
                                type="text"
                                class="red"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)"
                        >取消
                        </el-button>
                    </template>
                </el-table-column>
              
            </el-table>
           
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="page.pageIndex"
                        :page-size="page.pageSize"
                       
                      
                ></el-pagination>
            </div>
        </div>

        
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
              
                userName:"",
                roleId:"",
               // currentBusinessType:"",           // 当前类别（编辑用）
               // businessTypeList:[],             // 类别列表（编辑用）

            };
        },
        created() {
            const _this = this;
            this.userName = sessionStorage.getItem('loginName');
            this.roleId = sessionStorage.getItem('loginRole');
            
            if(this.roleId == 2) {
                axios.get('/api/task/data/query'
                +'?page=1&size=5&barberName='+this.userName
                ).then(function(resp){ 
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
          
                });

            } else{
           
                axios.get('/api/task/data/query'
                +'?page=1&size=5&customerName='+this.userName
                ).then(function(resp){ 
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
            
                });
            }
            
       
        },
        methods: {  
            handleDelete(index, row) {
                const _this = this;
                axios.get('/api/broken/promise/query/by/customerId?customerId='+row.customerId
                ).then(function(resp){ 
                    var num = null;
                   
                    if(resp.data.extend.brokenPromise == null) {
                        num = 0
                    } else{
                        num = resp.data.extend.brokenPromise.brokenNumber;
                    }
                     
                    if(num >= 5) {
                        _this.$confirm('您本月的违约次数已达'+num+'次，超过10次将被封号, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axios.post('http://127.0.0.1:8081/api/task/cancel', 
                        {      
                        "taskId":row.id,
                        "roleId":_this.roleId
                        }).then(function (response) {
                        _this.$message.success('取消成功');
                        _this.total = _this.total - 1;
                        if(_this.total % _this.pageSize == 1) {
                            _this.page(_this.currentPage - 1);
                        } else {
                            _this.page(_this.currentPage);
                        }
                   
                    });
                    }).catch(() => {
                        _this.$message({
                            type: 'info',
                            message: '已取消'
                        });          
                    });
                } else {
                    axios.post('http://127.0.0.1:8081/api/task/cancel', 
                    {      
                    "taskId":row.id,
                    "roleId":_this.roleId
                    }).then(function (response) {
                    _this.total = _this.total - 1;
                    _this.$message.success('取消成功');
                    if(_this.total % _this.pageSize == 1) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }
                    });
                }
                });
             
                
            },
            
            page(currentPage){
            const _this = this;
            this.userName = sessionStorage.getItem('loginName');
            this.roleId = sessionStorage.getItem('loginRole');
            
            if(this.roleId == 2) {
                axios.get('/api/task/data/query'
                +'?page=1&size=5&barberName='+this.userName
                ).then(function(resp){ 
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
          
                });

            } else{
           
                axios.get('/api/task/data/query'
                +'?page=1&size=5&customerName='+this.userName
                ).then(function(resp){ 
                var pageInfo = resp.data.extend.pageInfo;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                _this.currentPage = pageInfo.pageNum;
            
                });
            }
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
