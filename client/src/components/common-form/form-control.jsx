import { Label } from "../ui/label";

function FormControls({formControls=[],formData,setFormData}) {
    function renderComponentType(){

    }
    return ( 
        <div className=" flex flex-col gap-3">
            {
                formControls.map(controlItem=>
                    <div key={controlItem.name}>
                        <Label htmlFor={controlItem.name}>
                            {controlItem.label}
                        </Label>
                    </div>
                )
            }

        </div>
     );
}

export default FormControls;
