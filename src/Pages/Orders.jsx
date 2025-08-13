import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Components/ui/table";
import { Button } from "../Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../Components/ui/form";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../Components/ui/popover";
import { Calendar } from "../Components/ui/calendar";

// Validation schema
const orderSchema = z.object({
  _id: z.string().optional(),
  orderId: z.string().min(1, "Order ID is required"),
  valueRs: z.number({ invalid_type_error: "Value must be a number" }),
  route: z.string().optional(),
  deliveryTimestamp: z.date().optional(),
});

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderId: "",
      valueRs: 0,
      route: "",
      deliveryTimestamp: undefined,
    },
  });

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, []);

  const fetchOrders = async () => {
    const { data } = await axios.get("https://purple-merit-backend-plum.vercel.app/orders");
    setOrders(data);
  };

  const fetchRoutes = async () => {
    const { data } = await axios.get("https://purple-merit-backend-plum.vercel.app/routes");
    setRoutes(data);
  };

  const handleEdit = (order) => {
    form.reset({
      _id: order._id,
      orderId: order.orderId,
      valueRs: order.valueRs,
      route: order.route?._id || "",
      deliveryTimestamp: order.deliveryTimestamp ? new Date(order.deliveryTimestamp) : undefined,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://purple-merit-backend-plum.vercel.app/orders/${id}`);
    fetchOrders();
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      deliveryTimestamp: values.deliveryTimestamp ? values.deliveryTimestamp.toISOString() : null,
    };

    if (values._id) {
      await axios.put(`https://purple-merit-backend-plum.vercel.app/${values._id}`, payload);
    } else {
      await axios.post("https://purple-merit-backend-plum.vercel.app/orders", payload);
    }

    setOpen(false);
    fetchOrders();
  };

  return (
    <div className="p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="mb-4">
          <DialogTrigger asChild>
            <Button onClick={() => { form.reset(); setOpen(true); }}>Add Order</Button>
          </DialogTrigger>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Value (Rs)</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.valueRs}</TableCell>
                <TableCell>{order.route?.routeId}</TableCell>
                <TableCell>
                  {order.deliveryTimestamp ? new Date(order.deliveryTimestamp).toLocaleString() : ""}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(order)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(order._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="orderId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Order ID</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="valueRs" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (Rs)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="route" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map(route => (
                        <SelectItem key={route._id} value={route._id}>
                          {route.routeId} ({route.distanceKm} km)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <FormField name="deliveryTimestamp" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value ? format(field.value, "Pp") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )} />

              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
