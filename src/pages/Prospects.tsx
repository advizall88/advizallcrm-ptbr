
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dummyProspects = {
  new: [
    { id: 1, name: "Tech Solutions LLC", company: "Tech Solutions", score: 4, nextFollowUp: "Tomorrow" },
    { id: 2, name: "Global Marketing Inc", company: "Global Marketing", score: 3, nextFollowUp: "May 5" },
  ],
  interested: [
    { id: 3, name: "Quantum Designs", company: "Quantum Designs", score: 5, nextFollowUp: "Today" },
    { id: 4, name: "Future Innovations", company: "Future Innovations", score: 4, nextFollowUp: "May 3" },
  ],
  negotiation: [
    { id: 5, name: "Strategic Partners LLC", company: "Strategic Partners", score: 5, nextFollowUp: "Today" },
  ],
  lost: [
    { id: 6, name: "Previous Lead", company: "Previous Lead", score: 2, nextFollowUp: "None" },
  ],
};

const ProspectCard = ({ prospect }: { prospect: any }) => {
  return (
    <Card className="mb-3 shadow-neumorph-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-bold">{prospect.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-gray-500">{prospect.company}</div>
        <div className="flex items-center mt-1">
          {Array.from({ length: prospect.score }).map((_, i) => (
            <span key={i} className="text-yellow-500">★</span>
          ))}
          {Array.from({ length: 5 - prospect.score }).map((_, i) => (
            <span key={i} className="text-gray-300">★</span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Follow-up: {prospect.nextFollowUp}
        </div>
        <Button size="sm" variant="secondary" className="text-xs h-7">
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

const KanbanColumn = ({ title, prospects, color }: { title: string; prospects: any[]; color: string }) => {
  return (
    <div className="flex flex-col min-w-[250px] md:min-w-[280px]">
      <div className={`px-4 py-2 rounded-t-lg ${color} text-white font-medium flex justify-between items-center`}>
        <span>{title}</span>
        <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full text-xs">
          {prospects.length}
        </span>
      </div>
      <div className="bg-gray-50 p-3 rounded-b-lg flex-1 border border-gray-200 overflow-y-auto max-h-[calc(100vh-240px)]">
        {prospects.map((prospect) => (
          <ProspectCard key={prospect.id} prospect={prospect} />
        ))}
        {prospects.length === 0 && (
          <div className="text-center text-gray-400 py-8">No prospects</div>
        )}
      </div>
    </div>
  );
};

const Prospects = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
            <p className="text-gray-500">Manage and track your sales pipeline.</p>
          </div>
          <Button variant="default" className="bg-secondary hover:bg-secondary/90">
            + Add Prospect
          </Button>
        </div>
        
        <div className="kanban-board flex space-x-6 overflow-x-auto pb-4">
          <KanbanColumn title="New" prospects={dummyProspects.new} color="bg-blue-500" />
          <KanbanColumn title="Interested" prospects={dummyProspects.interested} color="bg-green-500" />
          <KanbanColumn title="Negotiation" prospects={dummyProspects.negotiation} color="bg-purple-500" />
          <KanbanColumn title="Lost" prospects={dummyProspects.lost} color="bg-gray-500" />
        </div>
      </div>
    </AppLayout>
  );
};

export default Prospects;
