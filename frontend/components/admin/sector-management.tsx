'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard as Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Sector } from '@/lib/types';

export default function SectorManagement() {
  const { sectors, addSector, updateSector, deleteSector } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    lat: 0,
    lon: 0,
    tw_start: '09:00',
    tw_end: '17:00',
    priority: 2
  });

  const handleOpenDialog = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setFormData(sector);
    } else {
      setEditingSector(null);
      setFormData({
        id: '',
        name: '',
        lat: 0,
        lon: 0,
        tw_start: '09:00',
        tw_end: '17:00',
        priority: 2
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingSector) {
      updateSector(editingSector.id, formData);
    } else {
      addSector(formData as Sector);
    }
    setDialogOpen(false);
    setEditingSector(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 섹터를 삭제하시겠습니까?')) {
      deleteSector(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <h3 className="text-lg font-semibold">섹터 관리 ({sectors.length}개)</h3>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              섹터 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSector ? '섹터 수정' : '새 섹터 등록'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sector-id">섹터 ID</Label>
                <Input
                  id="sector-id"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  disabled={!!editingSector}
                />
              </div>
              
              <div>
                <Label htmlFor="sector-name">섹터 이름</Label>
                <Input
                  id="sector-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 군산A구역"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">위도</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.lat}
                    onChange={(e) => setFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="longitude">경도</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.lon}
                    onChange={(e) => setFormData(prev => ({ ...prev, lon: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              {/* 시간창 및 우선순위 필드는 요구사항에 따라 제거 */}
              
              <Button onClick={handleSubmit} className="w-full">
                {editingSector ? '수정' : '등록'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>섹터 ID</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>좌표</TableHead>
              {/* 시간창/우선순위 컬럼 제거 */}
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => (
              <TableRow key={sector.id}>
                <TableCell>
                  <Badge variant="outline">{sector.id}</Badge>
                </TableCell>
                <TableCell className="font-medium">{sector.name}</TableCell>
                <TableCell className="font-mono text-sm">
                  {sector.lat.toFixed(4)}, {sector.lon.toFixed(4)}
                </TableCell>
                {/* 시간창/우선순위 표시는 요구사항에 따라 제거 */}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(sector)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sector.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}