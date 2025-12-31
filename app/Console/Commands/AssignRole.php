<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

/**
 * Comando para asignar un rol a un usuario existente.
 */
class AssignRole extends Command
{
    protected $signature = 'user:assign-role {email} {role}';
    protected $description = 'Asigna un rol a un usuario por email';

    public function handle(): int
    {
        $email = $this->argument('email');
        $role = $this->argument('role');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Usuario con email '{$email}' no encontrado.");
            return 1;
        }

        if ($user->hasRole($role)) {
            $this->info("El usuario ya tiene el rol '{$role}'.");
            return 0;
        }

        $user->assignRole($role);
        $this->info("Rol '{$role}' asignado a {$user->name} ({$email}).");
        
        return 0;
    }
}
