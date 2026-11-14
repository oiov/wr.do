"use client";

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Link as LinkIcon,
  Plus,
  Copy,
  ExternalLink,
  BarChart3,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  TrendingUp,
  Calendar,
  MousePointerClick,
} from 'lucide-react';
import { toast } from 'sonner';

interface LinkData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  title: string;
  createdAt: Date;
  expiresAt?: Date;
  clicks: number;
  status: 'active' | 'inactive' | 'expired';
  tags: string[];
  clickData: {
    date: string;
    clicks: number;
    uniqueVisitors: number;
  }[];
}

const Links = () => {
  const [links, setLinks] = useState<LinkData[]>([
    {
      id: '1',
      originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
      shortUrl: 'https://stml.ink/abc123',
      shortCode: 'abc123',
      title: 'Product Launch Page',
      createdAt: new Date('2025-12-01'),
      clicks: 1247,
      status: 'active',
      tags: ['marketing', 'product'],
      clickData: [
        { date: '2025-12-07', clicks: 45, uniqueVisitors: 38 },
        { date: '2025-12-08', clicks: 67, uniqueVisitors: 52 },
        { date: '2025-12-09', clicks: 89, uniqueVisitors: 71 },
        { date: '2025-12-10', clicks: 123, uniqueVisitors: 98 },
        { date: '2025-12-11', clicks: 156, uniqueVisitors: 124 },
        { date: '2025-12-12', clicks: 178, uniqueVisitors: 142 },
        { date: '2025-12-13', clicks: 92, uniqueVisitors: 74 },
      ],
    },
    {
      id: '2',
      originalUrl: 'https://example.com/blog/how-to-use-stellarmail',
      shortUrl: 'https://stml.ink/xyz789',
      shortCode: 'xyz789',
      title: 'Blog: Getting Started',
      createdAt: new Date('2025-12-05'),
      clicks: 834,
      status: 'active',
      tags: ['blog', 'tutorial'],
      clickData: [
        { date: '2025-12-07', clicks: 32, uniqueVisitors: 28 },
        { date: '2025-12-08', clicks: 41, uniqueVisitors: 35 },
        { date: '2025-12-09', clicks: 56, uniqueVisitors: 47 },
        { date: '2025-12-10', clicks: 67, uniqueVisitors: 54 },
        { date: '2025-12-11', clicks: 78, uniqueVisitors: 63 },
        { date: '2025-12-12', clicks: 89, uniqueVisitors: 72 },
        { date: '2025-12-13', clicks: 45, uniqueVisitors: 38 },
      ],
    },
    {
      id: '3',
      originalUrl: 'https://example.com/campaign/black-friday-2025',
      shortUrl: 'https://stml.ink/bf2025',
      shortCode: 'bf2025',
      title: 'Black Friday Campaign',
      createdAt: new Date('2025-11-15'),
      expiresAt: new Date('2025-11-30'),
      clicks: 5621,
      status: 'expired',
      tags: ['campaign', 'sales'],
      clickData: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);

  // New link form state
  const [newLink, setNewLink] = useState({
    originalUrl: '',
    title: '',
    customCode: '',
    tags: '',
  });

  // Filter and search links
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || link.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [links, searchQuery, statusFilter]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const activeLinks = links.filter((l) => l.status === 'active').length;
    const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
    const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;

    return { activeLinks, totalClicks, avgClicks };
  }, [links]);

  // Handle create new link
  const handleCreateLink = () => {
    if (!newLink.originalUrl || !newLink.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    const shortCode =
      newLink.customCode || Math.random().toString(36).substring(2, 8);

    const link: LinkData = {
      id: Date.now().toString(),
      originalUrl: newLink.originalUrl,
      shortUrl: `https://stml.ink/${shortCode}`,
      shortCode,
      title: newLink.title,
      createdAt: new Date(),
      clicks: 0,
      status: 'active',
      tags: newLink.tags.split(',').map((t) => t.trim()).filter(Boolean),
      clickData: [],
    };

    setLinks([link, ...links]);
    setNewLink({ originalUrl: '', title: '', customCode: '', tags: '' });
    setIsCreateDialogOpen(false);
    toast.success('Link created successfully!');
  };

  // Handle copy link
  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Link copied to clipboard!');
  };

  // Handle toggle link status
  const handleToggleStatus = (id: string) => {
    setLinks(
      links.map((link) => {
        if (link.id === id) {
          const newStatus =
            link.status === 'active' ? 'inactive' : 'active';
          toast.success(
            `Link ${newStatus === 'active' ? 'activated' : 'deactivated'}`
          );
          return { ...link, status: newStatus };
        }
        return link;
      })
    );
  };

  // Handle delete link
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
    toast.success('Link deleted successfully');
  };

  // Handle view analytics
  const handleViewAnalytics = (link: LinkData) => {
    setSelectedLink(link);
    setIsAnalyticsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Link Management</h2>
          <p className="text-muted-foreground">
            Create and manage shortened URLs with analytics
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Short Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Short Link</DialogTitle>
              <DialogDescription>
                Create a shortened URL with custom tracking and analytics
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Product Launch Page"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Original URL *</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/very-long-url"
                  value={newLink.originalUrl}
                  onChange={(e) =>
                    setNewLink({ ...newLink, originalUrl: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom">Custom Short Code (Optional)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    stml.ink/
                  </span>
                  <Input
                    id="custom"
                    placeholder="abc123"
                    value={newLink.customCode}
                    onChange={(e) =>
                      setNewLink({ ...newLink, customCode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="marketing, product, campaign"
                  value={newLink.tags}
                  onChange={(e) =>
                    setNewLink({ ...newLink, tags: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateLink}>Create Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Links
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeLinks}</div>
            <p className="text-xs text-muted-foreground">
              {links.length} total links
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all links
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Clicks/Link
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.avgClicks}</div>
            <p className="text-xs text-muted-foreground">
              Performance metric
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>
            Manage and track your shortened URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Links Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No links found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {link.originalUrl}
                          </div>
                          {link.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {link.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {link.shortCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyLink(link.shortUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {link.clicks.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            link.status === 'active'
                              ? 'default'
                              : link.status === 'inactive'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {link.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {link.createdAt.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewAnalytics(link)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleStatus(link.id)}
                            disabled={link.status === 'expired'}
                          >
                            {link.status === 'active' ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Link Analytics</DialogTitle>
            <DialogDescription>
              {selectedLink?.title} - {selectedLink?.shortUrl}
            </DialogDescription>
          </DialogHeader>
          {selectedLink && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Clicks
                    </CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedLink.clicks.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Status
                    </CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={
                        selectedLink.status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {selectedLink.status}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Created
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      {selectedLink.createdAt.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              {selectedLink.clickData.length > 0 && (
                <Tabs defaultValue="clicks" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="clicks">Click Trends</TabsTrigger>
                    <TabsTrigger value="visitors">Unique Visitors</TabsTrigger>
                  </TabsList>
                  <TabsContent value="clicks" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Clicks Over Time</CardTitle>
                        <CardDescription>
                          Daily click performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={selectedLink.clickData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="clicks"
                              stroke="#8884d8"
                              fill="#8884d8"
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="visitors" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Unique Visitors</CardTitle>
                        <CardDescription>
                          Daily unique visitor count
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={selectedLink.clickData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="uniqueVisitors" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {/* Link Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Link Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Short URL:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm">{selectedLink.shortUrl}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyLink(selectedLink.shortUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Original URL:
                    </span>
                    <a
                      href={selectedLink.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  {selectedLink.tags.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      <div className="flex gap-1">
                        {selectedLink.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Links;