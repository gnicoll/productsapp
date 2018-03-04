(function(){

	var productsapp = angular.module('productsApp', []);

    //productsService is used for the http call
    productsapp.service('productsService', ['$http', function($http){
        this.getProducts = function(onLoaded){
            var url = "/products.json";
            $http({method:'GET',url: "/data/products.json"}).
                then(function(response){
                    onLoaded(response.data);
                }, function(response){
                    //failure
                });
        } 
    }]);


	productsapp.controller('productsController', function ($scope, productsService) {
        //PUBLIC 
        //all products in the inventory (unfiltered)
        $scope.allProducts = [];
        // the list of products to display (filtered or unfiltered)
        $scope.displayProducts = [];
        // size filter parameter 
        $scope.sizeFilterValue="";
        // a flag to tell when the data has loaded
        $scope.dataLoaded = false;
        // the sizes filter options
        $scope.sizes = []// ["XS", "S", "M", "L", "XL"];

        //fired when the sizeFilterValue changes
        $scope.sizeFilterChanged = function(){
            filterProducts();
        }

        //PRIVATE
        function loadData(){
            $scope.data = productsService.getProducts(function(data){
                loadProducts(data);
            });
        }

        //empty and reload the display list using the current filter value
        function filterProducts(){
            //empty the display list first
            $scope.displayProducts = [];
            //if the filter is empty then show all products
            if ($scope.sizeFilterValue == ""){
                $scope.displayProducts = $scope.allProducts;
            }
            else {
                for (var i = 0; i<$scope.allProducts.length; i++) {
                    //if the product is avaliable in the size specified
                    if ($scope.allProducts[i].size.includes($scope.sizeFilterValue)){
                        $scope.displayProducts.push($scope.allProducts[i]);
                    }
                }
            }
        }

        function loadProducts (data){
            //prepare/shape the product data
            for(i=0;i<data.length;i++){
                // add labels (sale/exclusive)
                data[i].labels = [];
                if (data[i].isExclusive){
                    data[i].labels.push({'label':"Exclusive",'class':"exclusive"});
                }                
                if (data[i].isSale){
                    data[i].labels.push({'label':"Sale",'class':"sale"});
                }                

                //load size filters from data
                //for each size in the product
                for(j=0;j<data[i].size.length;j++){
                    //if the size is not already in sizes filter list add it 
                    if (! $scope.sizes.includes(data[i].size[j])) {
                        $scope.sizes.push(data[i].size[j]);
                    }
                }//*/

            }

            //load the data
            $scope.allProducts = data;
            //load the displayProducts
            filterProducts();
            
            $scope.dataLoaded = true;
        }

        //initialise the controller 
        loadData();

	});

}());
