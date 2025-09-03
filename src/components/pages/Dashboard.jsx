import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import MetricCard from "@/components/molecules/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { leadService } from "@/services/api/leadService";
import { activityService } from "@/services/api/activityService";
import { format, isThisMonth, parseISO } from "date-fns";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pipelineValue: 0,
    monthlyDeals: 0
  });
  const [activities, setActivities] = useState([]);
  const [pipelineData, setPipelineData] = useState({
    series: [],
    options: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [contacts, deals, leads, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        leadService.getAll(),
        activityService.getAll()
      ]);

      // Calculate metrics
      const totalContacts = contacts.length;
      const activeDeals = deals.filter(deal => !["closed-won", "closed-lost"].includes(deal.stage)).length;
      const pipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const monthlyDeals = deals.filter(deal => 
        isThisMonth(parseISO(deal.expectedCloseDate))
      ).length;

      setMetrics({
        totalContacts,
        activeDeals,
        pipelineValue,
        monthlyDeals
      });

      setActivities(activitiesData.slice(0, 5));

      // Pipeline chart data
      const stageGroups = deals.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        series: Object.values(stageGroups),
        options: {
          chart: {
            type: "donut",
            height: 350
          },
          labels: Object.keys(stageGroups).map(stage => 
            stage.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())
          ),
          colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
          legend: {
            position: "bottom"
          },
          plotOptions: {
            pie: {
              donut: {
                size: "70%"
              }
            }
          },
          dataLabels: {
            enabled: false
          }
        }
      };

      setPipelineData(chartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare"
    };
    return icons[type] || "Activity";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Contacts"
            value={metrics.totalContacts.toString()}
            icon="Users"
            trend="up"
            trendValue="+12%"
            gradient={true}
          />
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals.toString()}
            icon="TrendingUp"
            trend="up"
            trendValue="+8%"
            gradient={true}
          />
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            icon="DollarSign"
            trend="up"
            trendValue="+15%"
            gradient={true}
          />
          <MetricCard
            title="Closing This Month"
            value={metrics.monthlyDeals.toString()}
            icon="Calendar"
            trend="up"
            trendValue="+5%"
            gradient={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Overview Chart */}
          <Card className="transform hover:scale-[1.02] transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="PieChart" className="h-5 w-5 mr-2 text-primary-600" />
                Pipeline Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineData.series.length > 0 ? (
                <Chart
                  options={pipelineData.options}
                  series={pipelineData.series}
                  type="donut"
                  height={300}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="PieChart" className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No pipeline data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="transform hover:scale-[1.02] transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Activity" className="h-5 w-5 mr-2 text-primary-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <ApperIcon 
                          name={getActivityIcon(activity.type)} 
                          className="h-4 w-4 text-primary-600" 
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(parseISO(activity.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Activity" className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;