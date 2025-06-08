export default function Loading (){
    return(
        <div className="flex justify-center items-center h-64 pr-20">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-indigo-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </div>
    )
}