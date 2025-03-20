import "./rec.css";


const Top = ({title , bit}) => {

  
 
  return (
    <div className="flex items-center justify-between bg-gray-900 gap-8 lg:pt-15 pt-10 px-4 max-sm:flex-col sm:px-16">
      <div className={`ml-4 flex ${bit ? "flex-col gap-2" : "gap-10 items-center"}   justify-center  max-sm:flex-col`}>
        <h3 className=" text-8xl font-bold stroke lg:text-9xl">{title}</h3>

        <div className="flex flex-col gap-2 max-sm:text-center">
         {!bit && (
          <>
           <h3 className="text-xl font-semibold  uppercase tracking-[10px]">
            Movies
            </h3>
          <h3 className="text-xl font-semibold tracking-[10px]">TODAY</h3>
          </>
          )
        }
        </div>
      </div>

     
    </div>
  );
};

export default Top;
