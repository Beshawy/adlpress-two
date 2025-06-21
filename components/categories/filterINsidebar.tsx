"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const items = [
  {
    id: "digital-market",
    label: "السوق الرقمي",
  },
  {
    id: "hardware-house",
    label: "بيت الأجهزة",
  },
  {
    id: "gear-group",
    label: "مجموعة العتاد",
  },
  {
    id: "the-micro",
    label: "المايكرو",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "يجب عليك تحديد عنصر واحد على الأقل.",
  }),
  bestSelling: z.boolean().optional(),
  topRated: z.boolean().optional(),
});

export default function FilterINsidebar() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["hardware-house", "gear-group"],
      bestSelling: false,
      topRated: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const queryParams = new URLSearchParams();

    data.items.forEach((item) => queryParams.append("items", item));

    if (data.bestSelling) queryParams.append("best_selling", "true");
    if (data.topRated) queryParams.append("top_rated", "true");

    const url = `https://yourwebsite.com/filter?${queryParams.toString()}`;
    console.log(url);

    toast({
      title: "تم إنشاء الرابط:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{url}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base font-bold">البائعون</FormLabel>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) =>
                            checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value.filter(
                                    (value) => value !== item.id
                                  )
                                )
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bestSelling"
          render={({ field }) => (
            <div className="flex flex-col items-start gap-3">
              <Label htmlFor="best-selling" className="font-bold">الأكثر مبيعًا</Label>
              <Switch
                id="best-selling"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="topRated"
          render={({ field }) => (
            <div className="flex flex-col items-start gap-3">
              <Label htmlFor="top-rated" className="font-bold">الأعلى تقييمًا</Label>
              <Switch
                id="top-rated"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
        <Button type="submit">إرسال</Button>
      </form>
    </Form>
  );
}
