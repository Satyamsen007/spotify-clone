import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Library } from 'lucide-react'
import AddAlbumDialog from './AddAlbumDialog'
import AlbumsTable from './AlbumsTable'

const AlbumsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className='flex items-center justify-between max-md:flex-col max-md:gap-4 max-md:justify-center'>
          <div>
            <CardTitle className="flex items-center gap-2 max-md:justify-center">
              <Library className='size-5 text-violet-500' />
              Albums Library
            </CardTitle>
            <CardDescription>Manage your album collection</CardDescription>
          </div>
          <AddAlbumDialog />
        </div>
      </CardHeader>
      <CardContent>
        <AlbumsTable />
      </CardContent>
    </Card>
  )
}

export default AlbumsTabContent