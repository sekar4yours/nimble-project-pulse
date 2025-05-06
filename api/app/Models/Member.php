
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
    ];

    /**
     * Get the projects for the member.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_member')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Get the tasks assigned to the member.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }
}
