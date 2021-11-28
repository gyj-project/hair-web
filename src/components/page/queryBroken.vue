<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>违约记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.name" placeholder="顾客名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    
            >
                <el-table-column prop="customerName" align="center" label="用户名"></el-table-column>
                <el-table-column prop="brokenNumber" align="center" label="违约次数"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
    export default {
        name: 'basetable',
        data() {
            return {
               // currentPage:,
                tableData:[],
                pageSize:5,
                total:0,
                search: {
                    name:"",
                    price:""
                   
                },
               
               
            };
        },
        created() {
            const _this = this;
            axios.get('/api/broken/promise/data/query'
            +'?page=1&size=5').then(function(resp){
            console.log(resp.data.extend.pageInfo);
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            })
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                const _this = this;
                axios.get('/api/business/data/query'
                +'?page=0&size=5'
                +'&businessName='+_this.search.name
                +'&businessPrice='+_this.search.price).then(function(resp){
                console.log(resp.data.extend.pageInfo);
            })
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            handleDelete(index, row) {
                const _this = this;
                axios.delete('/api/broken/promise/' + row.id
                ).then(function(resp){
                    _this.$message.success('删除成功');
                    if(_this.total % _this.pageSize == 1) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }
                    _this.getTypes();
                });
            },
           
            page(currentPage){
                const _this = this;
                currentPage = currentPage;
                axios.get('/api/business/data/query'
                +'?page='+ currentPage +'&size=5'
                +'&businessName='+_this.search.name
                +'&businessPrice='+_this.search.price).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
               
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
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
