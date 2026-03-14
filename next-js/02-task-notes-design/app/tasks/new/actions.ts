'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const priority = (formData.get('priority') as 'low' | 'medium' | 'high') || 'medium'

  if (!title || title.trim() === '') {
    throw new Error('Title is required')
  }
  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  console.log('Task created:', task)
  revalidatePath('/tasks')
  redirect('/tasks')
}
