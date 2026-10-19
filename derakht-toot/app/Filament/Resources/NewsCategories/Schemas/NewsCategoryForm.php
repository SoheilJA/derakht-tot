<?php

namespace App\Filament\Resources\NewsCategories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NewsCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('نام دسته بندی')->required()->required()->maxLength(255),

            TextInput::make("slug")->label('نشانی (slug)')->helperText('به انگلیسی و با خط تیره، مثل events')->required()->alphaDash()->unique(ignoreRecord: true)->maxLength(255),

            TextInput::make('sort_order')->label('ترتیب نمایش')->numeric()->default(0)->required(),
        ]);
    }
}
