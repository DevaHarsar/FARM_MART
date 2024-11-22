// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ isLoggedIn, isFarmer, username, onLogout, cartLength }) => {
//   return (
//     <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
//       <Link to="/" className="text-lg font-bold">Farm Mart</Link>
     
//       <div className="flex justify-end">
//         {!isLoggedIn ? (
//           <>
//             <Link to="/login" className="mx-2">Login</Link>
//             <Link to="/signup" className="mx-2">Signup</Link>
//           </>
//         ) : (
//           <>
//             {isFarmer ? (
//               <Link to="/farmer-dashboard" className="mx-2">Farmer Dashboard</Link>
              
//             ) : (
//               <Link to="/product-list" className="mx-2">Product List</Link>
              
//             )}
//             <div className="flex items-center">
//               <p className="mx-2">{username}</p>
//               <Link to="/cart" className="mx-2">
//                 <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-700 transition-all duration-200">
//                   Cart ({cartLength})
//                 </button>
//               </Link>
//               <button onClick={onLogout} className="mx-2 bg-red-500 p-1 rounded">Logout</button>
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isFarmer, username, onLogout, cartLength }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
      <Link to="/" className="text-lg font-bold">Farm Mart</Link>
      <div className="flex justify-end">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/signup" className="mx-2">Signup</Link>
          </>
        ) : (
          <>
            {isFarmer ? (
              <Link to="/farmer-dashboard" className="mx-2">Farmer Dashboard</Link>
            ) : (
              <Link to="/product-list" className="mx-2">Product List</Link>
            )}
            <div className="flex items-center">
             
              {!isFarmer && (
                <Link to="/cart" className="mx-2">
                  <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-700 transition-all duration-200">
                    Cart ({cartLength})
                  </button>
                </Link>
              )}
              <button onClick={onLogout} className="mx-2 bg-red-500 p-1 rounded">Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
