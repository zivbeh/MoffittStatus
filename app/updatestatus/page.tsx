"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  library: z.string().nonempty({ message: "Library is required" }),
  floor: z.string().optional(),
  busyScale: z.string().nonempty({ message: "Busy scale is required" }),
});

type FormData = z.infer<typeof formSchema>;

export default function UpdateStatusPage() {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      library: "Moffitt",
      floor: "1",
      busyScale: "3",
    },
  });

  async function onSubmit(values: FormData) {
    const currentTime = new Date().toISOString();

    const dataToSubmit = {
      ...values,
      timeStamp: currentTime,
    };

    const res = await fetch("/api/saveData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (res.ok) {
      alert("Data saved successfully!");
    } else {
      alert("Failed to save data.");
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Update Library Status</h1>
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Library Selection */}
        <FormField
          name="library"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Library</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  {["Moffitt", "Main Stacks", "Doe", "Haas"].map(
                    (library) => (
                      <Button
                        key={library}
                        type="button"
                        className={`px-4 py-2 rounded-md ${
                          field.value === library
                            ? "bg-gray-500 text-white"
                            : "bg-black text-white"
                        }`}
                        onClick={() => field.onChange(library)}
                      >
                        {library}
                      </Button>
                    )
                  )}
                </div>
              </FormControl>
              <FormMessage name="library" />
            </FormItem>
          )}
        />

        {/* Floor Selection */}
        {methods.watch("library") === "Moffitt" && (
          <FormField
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
                          field.value === floor
                            ? "bg-gray-500 text-white"
                            : "bg-black text-white"
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
        )}

        {/* Busy Scale Slider */}
        <FormField
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
                    onValueChange={(value) =>
                      field.onChange(String(value[0]))
                    }
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
      </Form>
    </div>
  );
}
