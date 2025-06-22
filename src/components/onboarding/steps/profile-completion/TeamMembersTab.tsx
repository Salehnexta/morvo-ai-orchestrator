
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TeamMembersTabProps {
  teamMembers: string[];
  addTeamMember: () => void;
  updateTeamMember: (index: number, value: string) => void;
  removeTeamMember: (index: number) => void;
}

export const TeamMembersTab: React.FC<TeamMembersTabProps> = ({
  teamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-white">أعضاء الفريق الرئيسيون</Label>
          <Button
            onClick={addTeamMember}
            variant="outline"
            size="sm"
            className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة عضو
          </Button>
        </div>
        
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={member}
                onChange={(e) => updateTeamMember(index, e.target.value)}
                placeholder="اسم ومنصب عضو الفريق..."
                className="bg-gray-700/80 border-gray-600/50 text-white flex-1"
              />
              {teamMembers.length > 1 && (
                <Button
                  onClick={() => removeTeamMember(index)}
                  variant="outline"
                  size="sm"
                  className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
