import { createClient } from '@/app/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

interface Convert {
  id: string
  photo: string
  full_name: string
  phone_number: string
  location: string
  created_at: string
}

export default async function ConvertsPage() {
  const supabase = await createClient()

  const { data: converts, error } = await supabase
    .from('converts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching converts:', error)
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading converts: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">New Converts</h1>
          <p className="text-muted-foreground text-lg">
            View all registered converts and their information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Converts Registry</CardTitle>
            <CardDescription>
              Total converts: {converts?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {converts && converts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {converts.map((convert: Convert) => (
                    <TableRow key={convert.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border">
                          <Image
                            src={convert.photo}
                            alt={`${convert.full_name}'s photo`}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {convert.full_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {convert.phone_number}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {convert.location}
                      </TableCell>
                      <TableCell>
                        {new Date(convert.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">No converts registered yet.</p>
                <p className="text-muted-foreground text-sm mt-2">
                  <Link href="/" className="text-primary hover:underline">
                    Register the first convert
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}