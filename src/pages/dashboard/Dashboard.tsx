
import React from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "recharts";
import { 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Cell
} from "recharts";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FileText, Users } from "lucide-react";

// Dummy data for charts
const weeklyData = [
  { name: "Mon", submissions: 4 },
  { name: "Tue", submissions: 6 },
  { name: "Wed", submissions: 8 },
  { name: "Thu", submissions: 10 },
  { name: "Fri", submissions: 7 },
  { name: "Sat", submissions: 2 },
  { name: "Sun", submissions: 3 },
];

const passFailData = [
  { name: "Pass", value: 65 },
  { name: "Fail", value: 35 },
];

const COLORS = ["#6366f1", "#e11d48"];

const activityFeed = [
  {
    id: 1,
    type: "test_created",
    title: "React Frontend Test",
    time: "30 minutes ago",
  },
  {
    id: 2,
    type: "candidate_submit",
    title: "John Smith submitted Node.js API Test",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "feedback_pending",
    title: "Feedback pending for 5 candidates",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "candidate_invite",
    title: "10 new candidates were invited",
    time: "2 days ago",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Stats Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Total Tests Created */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Total Tests Created
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 in the last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Candidates Invited */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Candidates Invited
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">
                    +10 from last week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Submissions Received */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Submissions Received
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">
                    67% completion rate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Average Completion Time */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Avg. Completion Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45m</div>
                  <p className="text-xs text-muted-foreground">
                    -5m from average
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Test Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="submissions"
                        name="Submissions"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Pass vs Fail Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={passFailData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {passFailData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Activity Feed Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col space-y-1 border-b pb-3 last:border-0"
                  >
                    <p className="font-medium">{item.title}</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                      <span className="text-xs font-medium text-primary">
                        {item.type === "test_created"
                          ? "Test Created"
                          : item.type === "candidate_submit"
                          ? "Submission"
                          : item.type === "feedback_pending"
                          ? "Feedback"
                          : "Invitation"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
