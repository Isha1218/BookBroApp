import React, { useState, useEffect } from "react";
import { LuMinus, LuPlus, LuAlignLeft, LuAlignCenter, LuAlignRight, LuAlignJustify } from "react-icons/lu";

const SettingItem = ({ label, children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '20px 0',
            width: '95%',
            margin: '0 auto',
            borderBottom: '1px solid #eee',
            boxSizing: 'border-box',
        }}>
            <p style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
            }}>{label}</p>
            <div>{children}</div>
        </div>
    );
};

const ButtonGroup = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            {children}
        </div>
    );
};

const ControlButton = ({ onClick, disabled, children, active }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                all: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                backgroundColor: active ? '#007AFF' : '#ececec',
                color: active ? 'white' : '#333',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                minWidth: '40px',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
            }}
        >
            {children}
        </button>
    );
};

const ColorSwatch = ({ color, onClick, active }) => {
    return (
        <button
            onClick={onClick}
            style={{
                all: 'unset',
                width: '40px',
                height: '40px',
                backgroundColor: color,
                borderRadius: '8px',
                cursor: 'pointer',
                border: active ? '3px solid #007AFF' : '2px solid #ddd',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
            }}
        />
    );
};

const ValueDisplay = ({ value, unit }) => {
    return (
        <span style={{
            padding: '8px 12px',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            minWidth: '60px',
            textAlign: 'center',
            border: '1px solid #e0e0e0'
        }}>
            {value}{unit}
        </span>
    );
};

const Settings = ({ onSettingsChange, initialSettings = {}, isApplyingSettings = false }) => {
    const [fontSize, setFontSize] = useState(initialSettings.fontSize);
    const [lineSpacing, setLineSpacing] = useState(initialSettings.lineSpacing);
    const [textAlignment, setTextAlignment] = useState(initialSettings.textAlignment);
    const [backgroundColor, setBackgroundColor] = useState(initialSettings.backgroundColor);

    const backgroundColors = [
        { name: 'White', color: '#ffffff' },
        { name: 'Cream', color: '#f9f7ed' },
        { name: 'Light Gray', color: '#f5f5f5' },
        { name: 'Sepia', color: '#f4ecd8' },
        { name: 'Dark Gray', color: '#2d2d2d' },
        { name: 'Black', color: '#1a1a1a' },
    ];

    const alignmentOptions = [
        { value: 'left', icon: LuAlignLeft, label: 'Left' },
        { value: 'center', icon: LuAlignCenter, label: 'Center' },
        { value: 'right', icon: LuAlignRight, label: 'Right' },
        { value: 'justify', icon: LuAlignJustify, label: 'Justify' },
    ];

    useEffect(() => {
        if (onSettingsChange) {
            onSettingsChange({
                fontSize,
                lineSpacing,
                textAlignment,
                backgroundColor
            });
        }
    }, [fontSize, lineSpacing, textAlignment, backgroundColor, onSettingsChange]);

    const handleFontSizeChange = (delta) => {
        setFontSize(prev => Math.max(10, Math.min(32, prev + delta)));
    };

    const handleLineSpacingChange = (delta) => {
        setLineSpacing(prev => Math.max(1.0, Math.min(3.0, prev + delta)));
    };

    const resetToDefaults = () => {
        setFontSize(20);
        setLineSpacing(1.5);
        setTextAlignment('justify');
        setBackgroundColor('#ffffff');
    };

    return (
        <div style={{ 
            width: "95%", 
            overflowY: "auto", 
            overflowX: "hidden", 
            maxHeight: "100%",
            position: 'relative'
        }}>
            {isApplyingSettings && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: '12px',
                    gap: '15px'
                }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #007AFF',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        Applying settings...<br/>
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                            Recalculating page locations
                        </span>
                    </p>
                </div>
            )}            
            <div style={{
                marginBottom: "15px",
                marginTop: "15px",
            }}>
                <p style={{
                    fontSize: "25px",
                    fontWeight: "700",
                    margin: 0,
                    wordSpacing: "3px",
                }}>
                    Settings
                </p>
            </div>

            <SettingItem label="Font Size">
                <ButtonGroup>
                    <ControlButton 
                        onClick={() => handleFontSizeChange(-2)}
                        disabled={fontSize <= 10}
                    >
                        <LuMinus size={16} />
                    </ControlButton>
                    <ValueDisplay value={fontSize} unit="px" />
                    <ControlButton 
                        onClick={() => handleFontSizeChange(2)}
                        disabled={fontSize >= 32}
                    >
                        <LuPlus size={16} />
                    </ControlButton>
                </ButtonGroup>
            </SettingItem>

            <SettingItem label="Line Spacing">
                <ButtonGroup>
                    <ControlButton 
                        onClick={() => handleLineSpacingChange(-0.1)}
                        disabled={lineSpacing <= 1.0}
                    >
                        <LuMinus size={16} />
                    </ControlButton>
                    <ValueDisplay value={lineSpacing.toFixed(1)} unit="x" />
                    <ControlButton 
                        onClick={() => handleLineSpacingChange(0.1)}
                        disabled={lineSpacing >= 3.0}
                    >
                        <LuPlus size={16} />
                    </ControlButton>
                </ButtonGroup>
            </SettingItem>

            <SettingItem label="Text Alignment">
                <ButtonGroup>
                    {alignmentOptions.map(({ value, icon: Icon, label }) => (
                        <ControlButton
                            key={value}
                            onClick={() => setTextAlignment(value)}
                            active={textAlignment === value}
                        >
                            <Icon size={16} />
                        </ControlButton>
                    ))}
                </ButtonGroup>
            </SettingItem>

            <SettingItem label="Background Color">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {backgroundColors.map(({ name, color }) => (
                            <ColorSwatch
                                key={color}
                                color={color}
                                onClick={() => setBackgroundColor(color)}
                                active={backgroundColor === color}
                            />
                        ))}
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#666',
                        fontStyle: 'italic'
                    }}>
                        Selected: {backgroundColors.find(bg => bg.color === backgroundColor)?.name || 'Custom'}
                    </p>
                </div>
            </SettingItem>

            <div style={{
                padding: '30px 0 20px 0',
                textAlign: 'center'
            }}>
                <div style={{
                    backgroundColor: '#f8f8f8',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e0e0e0'
                }}>
                    <p style={{
                        margin: '0 0 10px 0',
                        fontSize: '12px',
                        color: '#666',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Preview
                    </p>
                    <div style={{
                        backgroundColor: backgroundColor,
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: fontSize + 'px',
                        lineHeight: lineSpacing,
                        textAlign: textAlignment,
                        color: backgroundColor === '#1a1a1a' || backgroundColor === '#2d2d2d' ? '#ffffff' : '#333333',
                        transition: 'all 0.3s ease'
                    }}>
                        The quick brown fox jumps over the lazy dog. This is a preview of your reading settings.
                    </div>
                </div>
            </div>
            <button
                    onClick={resetToDefaults}
                    style={{
                        all: 'unset',
                        padding: '8px 16px',
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #ddd'
                    }}
                >
                    Reset Settings
                </button>
        </div>
    );
};

export default Settings;