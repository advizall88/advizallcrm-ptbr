import { useState } from "react";
import { Client } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, FileText, BookOpen } from "lucide-react";

interface NotesProps {
  client: Client;
  onUpdateNotes: (notes: string) => void;
}

export default function Notes({ client, onUpdateNotes }: NotesProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(client.notes || '');
  
  const handleSaveNotes = () => {
    onUpdateNotes(notesValue);
    setEditingNotes(false);
  };
  
  const handleCancelEdit = () => {
    setNotesValue(client.notes || '');
    setEditingNotes(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Notas do Cliente</h3>
        {!editingNotes ? (
          <Button onClick={() => setEditingNotes(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Notas
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveNotes}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Notas
            </Button>
          </div>
        )}
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editingNotes ? (
            <div className="space-y-2">
              {client.notes ? (
                <div className="whitespace-pre-wrap">{client.notes}</div>
              ) : (
                <div className="text-muted-foreground italic flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Nenhuma nota disponível. Clique em Editar Notas para adicionar algumas.
                </div>
              )}
            </div>
          ) : (
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Digite notas sobre este cliente..."
              className="min-h-[200px]"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 