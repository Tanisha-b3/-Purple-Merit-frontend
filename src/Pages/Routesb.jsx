import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../Components/ui/dialog";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../Components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../Components/ui/form";
import { Input } from "../Components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../Components/ui/select";
import { Trash2, Pencil } from "lucide-react";

// Validation schema
const routeSchema = z.object({
  _id: z.string().optional(),
  routeId: z.string().min(1, "Route ID is required"),
  distanceKm: z
    .string()
    .min(1, "Distance is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number"),
  trafficLevel: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Traffic Level is required" }),
  }),
  baseTimeMin: z
    .string()
    .min(1, "Base time is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number"),
});

export default function Routesb() {
  const [routes, setRoutes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      _id: "",
      routeId: "",
      distanceKm: "",
      trafficLevel: "",
      baseTimeMin: "",
    },
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data } = await axios.get("https://purple-merit-backend-plum.vercel.app/routes");
    setRoutes(data);
  };

  const handleAdd = () => {
    form.reset();
    setIsOpen(true);
  };

  const handleEdit = (route) => {
    form.reset({
      _id: route._id || "",
      routeId: route.routeId || "",
      distanceKm: String(route.distanceKm || ""),
      trafficLevel: route.trafficLevel || "",
      baseTimeMin: String(route.baseTimeMin || ""),
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://purple-merit-backend-plum.vercel.app/routes/${id}`);
    fetchRoutes();
  };

  const onSubmit = async (values) => {
    if (values._id) {
      await axios.put(`https://purple-merit-backend-plum.vercel.app/${values._id}`, {
        ...values,
        distanceKm: Number(values.distanceKm),
        baseTimeMin: Number(values.baseTimeMin),
      });
    } else {
      await axios.post("https://purple-merit-backend-plum.vercel.app/routes", {
        ...values,
        distanceKm: Number(values.distanceKm),
        baseTimeMin: Number(values.baseTimeMin),
      });
    }
    setIsOpen(false);
    fetchRoutes();
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAdd}>Add Route</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route ID</TableHead>
            <TableHead>Distance (km)</TableHead>
            <TableHead>Traffic Level</TableHead>
            <TableHead>Base Time (min)</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route._id}>
              <TableCell>{route.routeId}</TableCell>
              <TableCell>{route.distanceKm}</TableCell>
              <TableCell>{route.trafficLevel}</TableCell>
              <TableCell>{route.baseTimeMin}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(route)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(route._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Route Details</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="routeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distanceKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trafficLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Level</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select traffic level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Time (min)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
