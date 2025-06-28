import type { Route } from "./+types/country";
import { Link } from "react-router";
 
export async function clientLoader({params}: Route.LoaderArgs) {
    // This function can be used to fetch data if needed
    const stateName = params.countryName;
    const res = await fetch(`https://api.data.gov.my/data-catalogue/?id=hospital_beds`);
    const data = await res.json();

    const targetDate = "2022-01-01";
    const info = data.filter((state : any) =>{
            const macthedSearch =  state.state.includes(stateName)
            return macthedSearch && 
                state.date === targetDate && 
                state.district.toLowerCase() !== "all districts" && 
                state.type.toLowerCase() !== "all"
            })
    
    return info;
}


export default function Country({ loaderData }: Route.ComponentProps) {
    const loadData = loaderData || [];
    if (!loadData.length) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">No data found for this state.</h2>
                <h2>
                    <Link to={`/countries/`} className="text-blue-600 hover:underline text-lg">
                        Back to States
                    </Link>
                </h2>
            </div>
        );
    }
    
    return <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Hospital Beds in {loaderData[0].state} (2022)</h2>
        <h2 > 
            <Link to={`/countries/`} className="text-blue-600 hover:underline text-lg">
                                Back to States
                            </Link>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loaderData.map((state: any) => {
                const stateBeds = parseInt(state.beds, 10);
                
                const hospitalType = state.type.toLowerCase() 
                return (
                    <li key={state.district} className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">{state.district}</h3>
                        <p>Total Beds: {stateBeds}</p>
                        <p>Hospital Type: {hospitalType}</p>
                    </li>
                );
            })}
        </ul>
    </div>
}