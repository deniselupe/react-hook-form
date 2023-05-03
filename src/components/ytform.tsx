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
To summarize the changes in this code:
    - We have to make the error messages 
      we specified for each form control show in the UI.

To display error mesages:
    - destructure the `formState` object from useForm()
    - and then destructure the `errors` object from the `formState` object
    - the `errors` object contains errors for every field that has failed validations
    - we can access the `message` property for a field, and display it in the UI

This is how you support HTMl validations with react-hook-form.
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
    const { register, control, handleSubmit, formState } = form;
    const { name, ref, onChange, onBlur } = register("username", { required: 'Username is required.' }); // Value is <input />'s name attr value 
    const { errors } = formState;

    // passing onSubmit as an argument to handleSubmit gives it access to the form data, which we
    // can log to the console
    const onSubmit = (data: FormValues) => {
        console.log('Form submitted', data);
    };

    return (
        <div>
            <h1>YouTube Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} />
                    <p className="error">{errors.username?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" {...register("email", { 
                        pattern: {
                            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                            message: 'Invalid email format'
                        } 
                    })} />
                    <p className="error">{errors.email?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="channel">Channel</label>
                    <input type="text" id="channel" {...register("channel", { required: { value: true, message: 'Channel is required' } })} />
                    <p className="error">{errors.channel?.message}</p>
                </div>

                <button>Submit</button>
            </form>
            <DevT control={control} />
        </div>
    );
};

export default YouTubeForm;