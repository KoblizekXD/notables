"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllPublicCollections } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye, LibraryBig, Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type PublicCollectionData = {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
};

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export default function PublicCollectionsPage({
  initialCollections,
}: {
  initialCollections: PublicCollectionData[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const {
    data: collections = initialCollections,
    isLoading,
    refetch,
  } = useQuery<PublicCollectionData[]>({
    queryKey: ["public-collections", searchQuery, sortBy],
    queryFn: () => getAllPublicCollections(searchQuery, sortBy),
    initialData: initialCollections,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void refetch();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [refetch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const sortOptions = [
    { value: "newest", label: "Most Recent" },
    { value: "oldest", label: "Oldest" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Public Collections</h1>
        <p className="text-muted-foreground">
          Discover and explore collections shared by the community
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search collections, descriptions, or authors..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading || collections.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <LibraryBig className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {searchQuery
                ? "No collections found"
                : "No public collections yet"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or filters."
                : "Be the first to create and share a public collection!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="space-y-3 relative z-10 rounded-lg border hover:shadow-md transition-all duration-200 hover:border-primary/20 block">
              <Link className="group" href={`/collection/${collection.id}`}>
                <div className="p-4">
                  <div className="flex flex-row items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h1 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {collection.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {collection.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {formatDate(collection.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={`/profile/${collection.author.id}`}
                className="flex items-center gap-2 mt-2 p-4 border-t group">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={collection.author.image ?? ""}
                    alt={collection.author.name}
                  />
                  <AvatarFallback>
                    <User className="w-3 h-3 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm group-hover:text-primary transition-colors truncate">
                  {collection.author.name}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
