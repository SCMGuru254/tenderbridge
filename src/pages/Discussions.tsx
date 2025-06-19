                    <DialogDescription>
                      Share your thoughts, questions, or insights with the supply chain community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <DiscussionForm onSuccess={handleCreateSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
import { useState } from "react";
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs
                defaultValue="latest"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                <TabsContent value="latest" className="mt-4">
                  <p className="text-sm text-muted-foreground">Most recent discussions</p>
                </TabsContent>
                <TabsContent value="popular" className="mt-4">
                  <p className="text-sm text-muted-foreground">Most engaged discussions</p>
                </TabsContent>
              </Tabs>

              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60"
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter by Tags</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {supplyChainTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => toggleTag(tag)}
                            />
                            <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                          </div>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTags([])}
                          className="w-full"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
  const { data: discussions, isLoading, refetch } = useQuery({
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredDiscussions?.length === 0 ? (
              <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No discussions found</h3>
                <p className="mb-6">Be the first to start a discussion about supply chain topics</p>
                {isUserLoggedIn && (
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Start a Discussion
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDiscussions?.map((discussion) => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    onReport={() => refetch()}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li>Be respectful and constructive in your discussions</li>
                <li>Share your professional experiences and insights</li>
                <li>Cite sources when sharing information</li>
                <li>Avoid self-promotion or spam</li>
                <li>Report inappropriate content</li>
              </ul>
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {supplyChainTags.slice(0, 8).map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PullToRefresh>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Supply Chain Discussions</h1>

          {isUserLoggedIn && (
            <>
              {/* Desktop create button */}
              <div className="hidden md:block">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Start Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your thoughts, questions, or insights with the supply chain community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <DiscussionForm onSuccess={handleCreateSuccess} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Mobile FAB */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <FAB aria-label="Create new discussion" />
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-3xl mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs 
              defaultValue="latest" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              <TabsContent value="latest" className="mt-4">
                <p className="text-sm text-muted-foreground">Most recent discussions</p>
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                <p className="text-sm text-muted-foreground">Most engaged discussions</p>
              </TabsContent>
            </Tabs>
            
            <div className="flex w-full sm:w-auto gap-2">
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Tags</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {supplyChainTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`} 
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                          />
                          <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                        </div>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedTags([])}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredDiscussions?.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No discussions found</h3>
              <p className="mb-6">Be the first to start a discussion about supply chain topics</p>
              {isUserLoggedIn && (
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start a Discussion
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDiscussions?.map((discussion) => (
                <DiscussionCard 
                  key={discussion.id} 
                  discussion={discussion}
                  onReport={() => refetch()}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
            <ul className="space-y-2 text-sm">
              <li>Be respectful and constructive in your discussions</li>
              <li>Share your professional experiences and insights</li>
              <li>Cite sources when sharing information</li>
              <li>Avoid self-promotion or spam</li>
              <li>Report inappropriate content</li>
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {supplyChainTags.slice(0, 8).map(tag => (
                  <Button 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Discussions;
