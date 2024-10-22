"use client";
import './styles.css';
import { Slider } from "@/components/ui/slider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  floor: z.string(),
  busyScale: z.string(),
});

const UpdateForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      floor: "1",
      busyScale: "3",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const currentTime = new Date().toISOString();

    const dataToSubmit = {
      ...values,
      timeStamp: currentTime,
    };

    const res = await fetch('/api/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (res.ok) {
      alert('Data saved successfully!');
    } else {
      alert('Failed to save data.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What floor are you on?</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  {["1", "3", "4", "5"].map((floor) => (
                    <Button
                      key={floor}
                      type="button"
                      className={`px-4 py-2 rounded-md ${
                        field.value === floor ? "bg-gray-500 text-white" : "bg-black text-white"
                      }`}
                      onClick={() => field.onChange(floor)}
                    >
                      Floor {floor}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage name="floor" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busyScale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How busy is it? (1-5)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Slider
                    value={[Number(field.value)]}
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[3]}
                    onValueChange={(value) => field.onChange(String(value[0]))}
                    className="w-full"
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <strong>Status:</strong>{" "}
                    {Number(field.value) === 1 && "Wide Open"}
                    {Number(field.value) === 2 && "Not Too Busy"}
                    {Number(field.value) === 3 && "Kinda Busy"}
                    {Number(field.value) === 4 && "Very Busy"}
                    {Number(field.value) === 5 && "Extremely Busy"}
                  </div>
                </div>
              </FormControl>
              <FormMessage name="busyScale" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-grey-500"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default UpdateForm;
