import React from "react";
import pic1 from "../img/pic1.jpg";

const ViewProduct = () => {
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center view">
        <div className="h-[87%] w-[90%]  flex flex-row justify-center items-center view">
          <div className="h-full w-[50%] flex justify-center items-center ">
            <img
              src={pic1}
              alt="error"
              className="h-[65%] w-[90%] flex justify-center items-center border-2 bg-gray-500"
            />
          </div>
          <div className="h-full w-[50%] flex flex-col justify-center items-center ">
            <div className="h-[85%] w-[95%] flex flex-col justify-center items-center ">
              <div className="h-[80%] w-[50%] flex flex-col justify-center gap-y-5 items-start ">
                <p className="text-gray-700 font-semibold text-start">
                  CATEGORY: VEGIE
                </p>
                <h3 className="text-xl font-semibold text-start">
                  ITEM: POTATO
                </h3>
                <p className="text-lg font-bold text-start">
                  Quantity:{" "}
                  <input
                    type="number"
                    name="qty"
                    id="qty"
                    min="1"
                    max="10"
                    className="border-2 border-gray-400 rounded-md  h-[90%] w-[30%]"
                  />
                </p>
                <p className="text-lg font-bold">Mrp: $80 ($80 / kg)</p>
                <button type="button" className=" w-[60%] h-[10%] bg-amber-400">
                  Add to cart
                </button>
                <button type="button" className=" w-[60%] h-[10%] bg-amber-600">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
