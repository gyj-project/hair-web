<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>商品出售
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
           
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    
            >
                <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
                <el-table-column prop="goodsPrice" align="center" label="商品价格"></el-table-column>
                <el-table-column prop="goodsNum" align="center" label="商品剩余"></el-table-column>
             
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAdd(scope.$index, scope.row)"
                        >购买
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
                userId:"",
                addVisible:false,
                addForm:{                        // 新增表单
                    goodsId:"",
                    customerId:"",

                },
                barberList:[],
                form:"",
            };
        },
        created() {
            const _this = this;
            axios.get('/api/goods/data/query'
            +'?page=1&size=5'
            ).then(function(resp){
            console.log(resp.data.extend.pageInfo);
            var pageInfo = resp.data.extend.pageInfo;
            _this.tableData = pageInfo.list;
            _this.total = pageInfo.total;
            _this.pageSize = pageInfo.pageSize;
            _this.currentPage = pageInfo.pageNum;
            })
            var loc = location.href;//获取整个跳转地址内容，其实就是你传过来的整个地址字符串
            console.log("我的地址"+loc);
            var n1 = loc.length;//地址的总长
            var n2 = loc.indexOf("=");//取得=号的位置
            var parameter = loc.substr(n2+1, n1-n2);
            if(n2 != -1) {
                _this.$message.success('购买成功，您的单号是'+parameter+',请及时到店自取');
            }

        },
        methods: {
            
            
          
            page(currentPage){
                const _this = this;
               
                axios.get('/api/goods/data/query'
                +'?page='+currentPage+'&size=5').then(function(resp){
                var pageInfo = resp.data.extend.pageInfo;
                _this.currentPage = pageInfo.pageNum;
                _this.tableData = pageInfo.list;
                _this.total = pageInfo.total;
                _this.pageSize = pageInfo.pageSize;
                })
            },
            handleAdd(index, row) {
                this.userId = sessionStorage.getItem('userId');
                const _this = this;
                axios.post('/api/order',
                {      
                    "id":"",
                    "customerId":_this.userId,
                    "goodsId":row.id 
                }).then(function (response) {
                    if(response.data.code == 200) {
                       window.location.href="http://127.0.0.1:8081/alipay/goAlipay?orderId="
                       +response.data.extend.orderId;
                    //    window.open("http://127.0.0.1:8081/alipay/goAlipay?orderId="
                    //    +response.data.extend.orderId); 
                      
                       
                    } else {
                        _this.$message.error("没货了");
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
