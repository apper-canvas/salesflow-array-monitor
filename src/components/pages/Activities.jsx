import React, { useState, useEffect } from 'react';
import Layout from '@/components/organisms/Layout';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
import ActivityModal from '@/components/organisms/ActivityModal';
import ActivityFilters from '@/components/organisms/ActivityFilters';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { activityService } from '@/services/api/activityService';
import { toast } from 'react-toastify';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    activityTypes: [],
    entityTypes: [],
    searchQuery: ''
  });

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAll();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }

    // Apply activity type filter
    if (filters.activityTypes.length > 0) {
      filtered = filtered.filter(activity => 
        filters.activityTypes.includes(activity.type)
      );
    }

    // Apply entity type filter
    if (filters.entityTypes.length > 0) {
      filtered = filtered.filter(activity => 
        filters.entityTypes.includes(activity.entityType)
      );
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
  };

  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const success = await activityService.delete(activityId);
      if (success) {
        setActivities(prev => prev.filter(activity => activity.Id !== activityId));
        toast.success('Activity deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        // Update existing activity
        const updated = await activityService.update(selectedActivity.Id, activityData);
        if (updated) {
          setActivities(prev => prev.map(activity => 
            activity.Id === selectedActivity.Id ? updated : activity
          ));
          toast.success('Activity updated successfully');
          setIsModalOpen(false);
        }
      } else {
        // Create new activity
        const created = await activityService.create(activityData);
        if (created) {
          setActivities(prev => [created, ...prev]);
          toast.success('Activity created successfully');
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      activityTypes: [],
      entityTypes: [],
      searchQuery: ''
    });
  };

  const headerActions = (
    <div className="flex items-center space-x-4">
      <Button
        onClick={handleCreateActivity}
        icon="Plus"
        variant="primary"
        size="md"
      >
        New Activity
      </Button>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Activities" headerActions={headerActions}>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Activities" headerActions={headerActions}>
        <Error message={error} onRetry={loadActivities} />
      </Layout>
    );
  }

  return (
    <Layout title="Activities" headerActions={headerActions} showSearch={false}>
      <div className="space-y-6">
        {/* Filters */}
        <ActivityFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          totalCount={activities.length}
          filteredCount={filteredActivities.length}
        />

        {/* Timeline */}
        {filteredActivities.length > 0 ? (
          <ActivityTimeline
            activities={filteredActivities}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        ) : (
          <Empty 
            title="No activities found"
            description={filters.searchQuery || filters.activityTypes.length > 0 || filters.entityTypes.length > 0 || filters.dateRange.start
              ? "Try adjusting your filters to see more activities"
              : "Create your first activity to get started"
            }
            action={
              <Button onClick={handleCreateActivity} icon="Plus">
                Create Activity
              </Button>
            }
          />
        )}
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
        onSave={handleSaveActivity}
      />
    </Layout>
  );
};

export default Activities;