import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Heart, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { AppDispatch } from "@/store";
import { addToCart } from "@/services/features/cart/cartSlice";
import { getCartItems } from "@/utils/CartDb";
import { toast } from "sonner";
import useVisualization from "@/hooks/useVisualization";

const MoreProducts2 = ({ productsDemo }: { productsDemo: any }) => {
  const { products, loading, hasMore, loadingRef, formatPrice } =
    useVisualization(productsDemo);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const cart = getCartItems();
    const cartProductIds = cart?.map((item) => item.asin);
    setCartItems(cartProductIds);
  }, []);

  const handleAdd = (product: any) => {
    dispatch(addToCart(product));
    toast.success("Added to your cart", {
      description: `${product.product_title}`,
    });
    setCartItems((prev) => [...prev, product.asin]);
  };

  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Discover More
          </h2>
          <button className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <span className="font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <div
              key={product.asin}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.asin)}
              onMouseLeave={() => setHoveredProduct(null)}>
              <div className="relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-300">
                {/* Discount Tag */}
                {product.discount && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                      {product.discount}% OFF
                    </div>
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 p-2 rounded-full">
                  <Heart
                    className={`w-5 h-5 ${hoveredProduct === product.asin ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}
                  />
                </button>

                {/* Image */}
                <div className="aspect-square p-8">
                  <img
                    src={product.product_photo}
                    alt={product.product_title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                      {product.product_title}
                    </h3>
                    {/* <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>{product.delivery}</span>
                    </div> */}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(product.product_price)}
                        </span>
                        {/* {product.product_original_price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.product_original_price)}
                          </span>
                        )} */}
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ★ {product.product_star_rating ?? "New"}
                        </span>
                      </div>
                    </div>

                    {cartItems.includes(product.asin) ? (
                      <button
                        disabled
                        className="text-gray-400 p-3 rounded-full">
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-full transition-all duration-300">
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        <div ref={loadingRef} className="mt-12 text-center">
          {loading && (
            <div className="text-gray-500 dark:text-gray-400">
              Loading more products...
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              You've reached the end of the list
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreProducts2;
