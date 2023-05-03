import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

/*
I was unable to import DevTools the same way as the import statements 
above due to a hydration error that occurs. The error I experienced
was described perfectly by this user who had the same experience.

https://github.com/react-hook-form/devtools/issues/187

I am using the workaround that was provided as a solution in the comments of 
this issue discussion.
*/

/*
So far in this code I have:
    - Installed react-hook-form and @hookform/devtools
    - Used react-hook-form's useForm() hook
    - Learned about the different properties that are included in the object useForm() returns
    - Learned of the different properties that are included in the object register() returns
    - Using register() properties to track a form control
    - Using <DevTools /> to get a visual demonstration of the properties being tracked for a form control
    - Adding a second argument to register() to add validatio such as required, regex, min & max, etc
    - Creating a onSubmit handler function and passing it into useForms().handleSubmit() function to get access to the form's data
*/
const DevT: React.ElementType = dynamic(
  () => import('@hookform/devtools').then((module) => module.DevTool),
  { ssr: false }
);

interface FormValues {
    username: string;
    email: string;
    channel: string;
}

// react-hook-form tracks values without re-rendering
const YouTubeForm = () => {
    // Let useForm know that <FieldValues> Type Parameter will equal to <FormValues>
    const form = useForm<FormValues>();
    const { register, control, handleSubmit } = form;
    const { name, ref, onChange, onBlur } = register("username", { required: 'Username is required.' }); // Value is <input />'s name attr value 

    // passing onSubmit as an argument to handleSubmit gives it access to the form data, which we
    // can log to the console
    const onSubmit = (data: FormValues) => {
        console.log('Form submitted', data);
    };

    return (
        <div>
            <h1>YouTube Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} />
                <br />
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" {...register("email", { 
                    pattern: {
                        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        message: 'Invalid email format'
                    } 
                })} />
                <br />
                <label htmlFor="channel">Channel</label>
                <input type="text" id="channel" {...register("channel", { required: { value: true, message: 'Channel is required' } })} />
                <br />
                <button>Submit</button>
            </form>
            <DevT control={control} />
        </div>
    );
};

export default YouTubeForm;