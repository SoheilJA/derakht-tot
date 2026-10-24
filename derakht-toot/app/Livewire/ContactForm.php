<?php

namespace App\Livewire;

use App\Models\ContactMessage;
use App\Settings\HomeSettings;
use App\Support\Fa;
use Illuminate\Support\Facades\RateLimiter;
use Livewire\Component;

class ContactForm extends Component
{
    public string $name = '';

    public string $phone = '';

    public string $message = '';

    /** فیلد مخفی ضد اسپم؛ آدم‌ها خالی می‌گذارند */
    public string $website = '';

    public int $sentCount = 0;

    protected function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'phone' => ['required', 'regex:/^(\+98|0098|0)?9\d{9}$/'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    protected function messages(): array
    {
        return [
            'name.required' => 'نام خود را وارد کنید',
            'name.min' => 'نام باید حداقل ۳ نویسه باشد',
            'name.max' => 'نام نباید بیشتر از ۱۰۰ نویسه باشد',
            'phone.required' => 'شماره موبایل را وارد کنید',
            'phone.regex' => 'شماره موبایل معتبر وارد کنید (مانند ۰۹۱۵…)',
            'message.required' => 'پیام خود را بنویسید',
            'message.min' => 'پیام باید حداقل ۱۰ نویسه باشد',
            'message.max' => 'پیام نباید بیشتر از ۲۰۰۰ نویسه باشد',
        ];
    }

    public function submit(): void
    {
        // ربات‌ها فیلد مخفی را پر می‌کنند؛ ظاهراً موفق می‌شویم ولی چیزی ذخیره نمی‌کنیم
        if ($this->website !== '') {
            $this->finish();

            return;
        }

        $this->phone = preg_replace('/[\s-]/', '', Fa::latinDigits($this->phone));

        $this->validate();

        $key = 'contact-form:' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $this->addError('message', 'تعداد پیام‌های شما زیاد بوده است؛ لطفاً کمی بعد دوباره تلاش کنید.');

            return;
        }

        RateLimiter::hit($key, 600);

        ContactMessage::create([
            'name' => $this->name,
            'phone' => $this->phone,
            'message' => $this->message,
            'ip_address' => request()->ip(),
        ]);

        $this->finish();
    }

    private function finish(): void
    {
        $this->reset(['name', 'phone', 'message', 'website']);
        $this->resetValidation();
        $this->sentCount++;

        $this->dispatch('contact-sent');
    }

    public function render()
    {
        return view('livewire.contact-form', [
            'home' => app(HomeSettings::class),
        ]);
    }
}
