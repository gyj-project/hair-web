<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>消息通知
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.businessName" placeholder="标题" class="handle-input mr10"></el-input>
                
          
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                
            >
               
                <el-table-column  align="center" label="标题">
                    <template slot-scope="scope">
                        <span    @click="handleEdit(scope.$index, scope.row)" style="color: blue;">{{scope.row.title}}</span>
                    </template>

                </el-table-column>
                <el-table-column prop="publishTime" align="center" label="发布时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="roleId == 1">
                    <template slot-scope="scope">
                      
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
                search: {                        // 搜索条件
                    businessName:"",
                    businessType:"",
                },
                roleId:"",

            };
        },
        created() {
            const _this = this;
            console.log(axios)
            axios.get('/api/publish/info/data/query'
            +'?page=1&size=5'
            +'&businessName='+_this.search.businessName).then(function(resp){ 
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
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
                axios.delete('/api/publish/info/' + row.id
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

                axios.get('/api/publish/info/data/query'
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
            handleEdit(index, row){
                this.$router.push({path:'/publishInfo',query: {id:row.id}})
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
