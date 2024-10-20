"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { AcademicCapIcon } from "@heroicons/react/24/outline"
// import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  floor: z.string().min(1, { message: "Please select a floor." }),
  busyScale: z.string().min(1, { message: "Please select a busyness level." }),
})

const chartData = [
  { time: "12p", capacity: 186 },
  { time: "3p", capacity: 305 },
  { time: "6p", capacity: 237 },
  { time: "9p", capacity: 73 },
  { time: "12a", capacity: 214 },
]

const chartConfig = {
  capacity: {
    label: "Capacity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [floorOccupancy, setFloorOccupancy] = useState({
    1: 50,
    3: 50,
    4: 50,
    5: 50,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      floor: "",
      busyScale: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Simulating a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Submitted data:', values)

      // Update the floor occupancy based on the submission
      const busyScaleValue = Number(values.busyScale)
      const occupancyValue = busyScaleValue * 20 // Convert 1-5 scale to 20-100 scale

      setFloorOccupancy(prev => ({
        ...prev,
        [values.floor]: occupancyValue,
      }))

      // toast({
      //   title: "Update submitted",
      //   description: "Thank you for your contribution!",
      // })

      form.reset()
    } catch (error) {
      console.error('Error submitting update:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to submit update. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <AcademicCapIcon className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold">MoffittStatus</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Moffitt Capacity</CardTitle>
            <CardDescription>12pm - 12am</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="capacity" stroke="var(--color-capacity)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing capacity level for the last 12 hours
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Floor Breakdown</CardTitle>
              <CardDescription>Last updated 10 mins ago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(floorOccupancy).map(([floor, occupancy]) => (
                <div key={floor} className="flex items-center">
                  <span className="w-16 text-right mr-4">Floor {floor}</span>
                  <Progress className="flex-grow" value={occupancy} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">Haas or Doe</p>
              <CardDescription className="mt-2">
                If you are solo, then Floor 1 should be good.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit an Update</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What floor are you on?</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          {[1, 3, 4, 5].map((floorNumber) => (
                            <Button
                              key={floorNumber}
                              type="button"
                              className={`px-4 py-2 rounded-md ${
                                field.value === String(floorNumber) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                              }`}
                              onClick={() => field.onChange(String(floorNumber))}
                            >
                              Floor {floorNumber}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="busyScale"
                  render={({  }) => (
                    <FormItem>
                      <FormLabel>How busy is it? (1-5)</FormLabel>
                      <FormControl>
                        <Controller
                          name="busyScale"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <div className="space-y-3">
                              <Slider
                                value={value ? [Number(value)] : [0]}
                                min={1}
                                max={5}
                                step={1}
                                onValueChange={(newValue) => onChange(String(newValue[0]))}
                                className="w-full"
                              />
                              <div className="text-sm text-muted-foreground">
                                <strong>Status:</strong>{" "}
                                {!value && "Not selected"}
                                {value === "1" && "Wide Open"}
                                {value === "2" && "Not Too Busy"}
                                {value === "3" && "Kinda Busy"}
                                {value === "4" && "Very Busy"}
                                {value === "5" && "Extremely Busy"}
                              </div>
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm">
          follow us on{" "}
          <a
            href="https://www.instagram.com/moffittstatus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            instagram
          </a>
        </p>
      </div>
    </div>
  )
}