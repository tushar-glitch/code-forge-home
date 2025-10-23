import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const Billing: React.FC = () => {
  return (
    <DashboardLayout title="Billing">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the <strong>Pro</strong> plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">$99/month</p>
                  <p className="text-muted-foreground">Billed monthly</p>
                </div>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>The card that will be used for future payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src="/visa.svg" alt="Visa" className="h-8" />
                  <p>Visa ending in 1234</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Oct 1, 2025</td>
                    <td className="py-2">$99.00</td>
                    <td className="py-2">Paid</td>
                    <td className="py-2 text-right"><Button variant="link">Download</Button></td>
                  </tr>
                  <tr>
                    <td className="py-2">Sep 1, 2025</td>
                    <td className="py-2">$99.00</td>
                    <td className="py-2">Paid</td>
                    <td className="py-2 text-right"><Button variant="link">Download</Button></td>
                  </tr>
                  <tr>
                    <td className="py-2">Aug 1, 2025</td>
                    <td className="py-2">$99.00</td>
                    <td className="py-2">Paid</td>
                    <td className="py-2 text-right"><Button variant="link">Download</Button></td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Billing;