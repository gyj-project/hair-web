<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>订单查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.id" placeholder="订单编号" class="handle-input mr10"></el-input>
               
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    
            >
                <el-table-column prop="id" align="center" label="编号"></el-table-column>
                <el-table-column prop="customerName" align="center" label="顾客"></el-table-column>
                <el-table-column prop="goodsName" align="center" label="商品"></el-table-column>
                <el-table-column label="操作"  align="center">
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
                currentPage:0,
                tableData:[],
                pageSize:5,
                total:0,
                search: {
                   id:"",
                },
                
            };
        },
        created() {
            const _this = this;
            axios.get('/api/order/data/query'
            +'?page=1&size=5'
           // +'&id='+_this.search.id
            ).then(function(resp){
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
               
                axios.get('/api/order/data/query'
                +'?page=1&size=5'
                +'&id='+_this.search.id
                ).then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.currentPage = pageInfo.pageNum;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                })
            },

            handleDelete(index, row) {
                const _this = this;
                axios.delete('/api/order/' + row.id
                ).then(function(resp){
                    _this.$message.success('删除成功');
                    if(_this.total % _this.pageSize == 1) {
                        _this.page(_this.currentPage - 1);
                    } else {
                        _this.page(_this.currentPage);
                    }
                    
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
